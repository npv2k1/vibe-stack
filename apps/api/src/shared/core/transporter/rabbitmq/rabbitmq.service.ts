import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, connect, Connection, ConsumeMessage, Options } from 'amqplib';

type ConsumerRegistration = {
  queue: string;
  onMessage: (msg: ConsumeMessage | null) => Promise<void>;
  options: Options.Consume;
};

type BindingRegistration = {
  queue: string;
  exchange: string;
  routingKey: string;
};

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private connection?: Connection;
  private channel?: Channel;
  private connectPromise?: Promise<void>;
  private reconnectTimer?: NodeJS.Timeout;
  private reconnectDelayMs = 2000;
  private readonly maxReconnectDelayMs = 30000;
  private consumerRegistrations: ConsumerRegistration[] = [];
  private bindingRegistrations: BindingRegistration[] = [];
  private consumerRecoveryTimers = new Map<string, NodeJS.Timeout>();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.handledConnect();
  }

  async handledConnect() {
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = this.connectInternal().finally(() => {
      this.connectPromise = undefined;
    });

    return this.connectPromise;
  }

  private async connectInternal() {
    try {
      const url =
        this.configService.get<string>('RABBITMQ_URL') || 'amqp://admin:snp2021213@rabbitmq:5672';

      console.log('Connecting to RabbitMQ at', url);
      this.connection = await connect(url);
      this.connection.on('close', () => {
        console.error('RabbitMQ connection closed');
        this.handleDisconnect();
      });
      this.connection.on('error', (error) => {
        console.error('RabbitMQ connection error:', error);
        this.handleDisconnect();
      });

      await this.createChannel();
      this.reconnectDelayMs = 2000;
      await this.restoreBindingsAndConsumers();
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      this.scheduleReconnect();
      throw error;
    }
  }

  private async createChannel() {
    if (!this.connection) {
      return;
    }

    this.channel = await this.connection.createChannel();
    this.channel.on('close', () => {
      console.error('RabbitMQ channel closed');
      this.handleChannelClose();
    });
    this.channel.on('error', (error) => {
      console.error('RabbitMQ channel error:', error);
      this.handleChannelClose();
    });
  }

  private handleDisconnect() {
    this.connection = undefined;
    this.channel = undefined;
    this.scheduleReconnect();
  }

  private handleChannelClose() {
    this.channel = undefined;
    this.scheduleReconnect();
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      return;
    }

    const delay = this.reconnectDelayMs;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.handledConnect().catch(() => undefined);
    }, delay);
    this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, this.maxReconnectDelayMs);
  }

  private async ensureChannel() {
    if (this.channel) {
      return;
    }

    await this.handledConnect();
    if (!this.channel) {
      throw new Error('RabbitMQ channel not available');
    }
  }

  async onModuleDestroy() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      console.error('Error closing RabbitMQ connections:', error);
    }
  }

  async assertQueue(queue: string, options: any = {}) {
    try {
      await this.ensureChannel();
      return await this.channel.assertQueue(queue, { durable: true, ...options });
    } catch (error) {
      console.error('Failed to assert queue:', error);
      throw error;
    }
  }

  async assertExchange(
    exchange: string,
    type: 'direct' | 'fanout' | 'topic' = 'direct',
    options: any = {}
  ) {
    try {
      await this.ensureChannel();
      return await this.channel.assertExchange(exchange, type, { durable: true, ...options });
    } catch (error) {
      console.error('Failed to assert exchange:', error);
      throw error;
    }
  }

  async publish(exchange: string, routingKey: string, content: any, options: any = {}) {
    try {
      await this.ensureChannel();
      await this.assertExchange(exchange);
      const buffer = Buffer.from(JSON.stringify(content));
      return this.channel.publish(exchange, routingKey, buffer, { persistent: true, ...options });
    } catch (error) {
      console.error('Failed to publish message:', error);
      throw error;
    }
  }

  async sendToQueue(queue: string, content: any, options: Options.Publish = {}) {
    try {
      await this.ensureChannel();
      await this.assertQueue(queue);
      const buffer = Buffer.from(JSON.stringify(content));
      return this.channel.sendToQueue(queue, buffer, { persistent: true, ...options });
    } catch (error) {
      console.error('Failed to send to queue:', error);
      throw error;
    }
  }

  async consume(
    queue: string,
    onMessage: (msg: ConsumeMessage | null) => Promise<void>,
    options: Options.Consume = {}
  ) {
    return this.consumeInternal(queue, onMessage, options, true);
  }

  private async consumeInternal(
    queue: string,
    onMessage: (msg: ConsumeMessage | null) => Promise<void>,
    options: Options.Consume,
    shouldStore: boolean
  ) {
    try {
      await this.ensureChannel();
      const delayQueue = `${queue}_delay`;
      const deadLetterQueue = `${queue}_dead_letter`;
      const delayMs = 5000;
      const maxRetries = 3;
      await this.assertQueue(queue);
      await this.assertQueue(deadLetterQueue);

      await this.assertQueue(delayQueue, {
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': queue,
          'x-message-ttl': delayMs,
        },
      });

      if (shouldStore) {
        this.consumerRegistrations.push({ queue, onMessage, options });
      }

      this.channel.prefetch(1);

      return await this.channel.consume(
        queue,
        async (msg) => {
          if (!msg) {
            this.scheduleConsumerRecovery(queue, onMessage, options);
            return;
          }

          const channel = this.channel;
          if (!channel) {
            this.scheduleReconnect();
            return;
          }

          try {
            await onMessage(msg);
            channel.ack(msg);
          } catch (error) {
            console.error('Error consuming message:', error);
            const headers = msg.properties.headers || {};
            const retryCount = headers['x-retry-count'] || 0;

            if (retryCount < maxRetries) {
              channel.sendToQueue(delayQueue, msg.content, {
                persistent: true,
                headers: {
                  ...headers,
                  'x-retry-count': retryCount + 1,
                },
              });
              channel.ack(msg);
            } else {
              console.error(`Max retries exceeded. Sending to DLQ: ${deadLetterQueue}`);
              channel.sendToQueue(deadLetterQueue, msg.content, {
                persistent: true,
                headers: {
                  ...headers,
                  'x-retry-count': retryCount + 1,
                },
              });
              channel.nack(msg, false, false);
            }
          }
        },
        {
          noAck: false,
          ...options,
        }
      );
    } catch (error) {
      console.error('Failed to consume messages:', error);
      throw error;
    }
  }

  private scheduleConsumerRecovery(
    queue: string,
    onMessage: (msg: ConsumeMessage | null) => Promise<void>,
    options: Options.Consume
  ) {
    if (this.consumerRecoveryTimers.has(queue)) {
      return;
    }

    const timer = setTimeout(() => {
      this.consumerRecoveryTimers.delete(queue);
      this.consumeInternal(queue, onMessage, options, false).catch(() => undefined);
    }, 1000);

    this.consumerRecoveryTimers.set(queue, timer);
  }

  private async restoreBindingsAndConsumers() {
    for (const binding of this.bindingRegistrations) {
      await this.bindQueueInternal(binding.queue, binding.exchange, binding.routingKey, false);
    }

    for (const consumer of this.consumerRegistrations) {
      await this.consumeInternal(consumer.queue, consumer.onMessage, consumer.options, false);
    }
  }

  async bindQueue(queue: string, exchange: string, routingKey: string) {
    return this.bindQueueInternal(queue, exchange, routingKey, true);
  }

  private async bindQueueInternal(
    queue: string,
    exchange: string,
    routingKey: string,
    shouldStore: boolean
  ) {
    try {
      await this.ensureChannel();
      await this.assertQueue(queue);
      await this.assertExchange(exchange);

      if (shouldStore) {
        const exists = this.bindingRegistrations.some(
          (item) =>
            item.queue === queue && item.exchange === exchange && item.routingKey === routingKey
        );
        if (!exists) {
          this.bindingRegistrations.push({ queue, exchange, routingKey });
        }
      }

      return await this.channel.bindQueue(queue, exchange, routingKey);
    } catch (error) {
      console.error('Failed to bind queue:', error);
      throw error;
    }
  }

  async getQueueStats(queue: string) {
    await this.ensureChannel();

    try {
      const result = await this.channel.checkQueue(queue);
      return {
        ok: true,
        exists: true,
        queue: result.queue,
        messageCount: result.messageCount,
        consumerCount: result.consumerCount,
      };
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return {
          ok: true,
          exists: false,
          queue,
          messageCount: 0,
          consumerCount: 0,
        };
      }
      throw error;
    }
  }

  async deleteQueue(queue: string, options: Options.DeleteQueue = {}) {
    await this.ensureChannel();

    try {
      const result = await this.channel.deleteQueue(queue, options);
      return {
        ok: true,
        queue,
        deleted: true,
        messageCount: result.messageCount,
      };
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return {
          ok: true,
          queue,
          deleted: false,
          messageCount: 0,
        };
      }
      throw error;
    }
  }

  async healthCheck() {
    try {
      await this.ensureChannel();
      return {
        ok: true,
        connected: true,
        channel: true,
      };
    } catch (error) {
      return {
        ok: false,
        connected: Boolean(this.connection),
        channel: Boolean(this.channel),
      };
    }
  }

  private isNotFoundError(error: unknown) {
    const message = (error as Error | undefined)?.message || '';
    const code = (error as { code?: number | string } | undefined)?.code;
    return message.includes('NOT-FOUND') || code === 404;
  }

  ack(message: ConsumeMessage) {
    this.channel?.ack(message);
  }

  nack(message: ConsumeMessage) {
    this.channel?.nack(message);
  }
}
