import { Body, Controller, Delete, Get, OnModuleInit, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SendToQueueDto } from './rabbitmq.dto';
import { RabbitMqService } from './rabbitmq.service';

@ApiTags('Rabbitmq')
@Controller('rabbitmq')
export class RabbitMqController implements OnModuleInit {
  constructor(private readonly rabbitMqService: RabbitMqService) {}

  async onModuleInit() {
    console.log('RabbitMQ Controller initialized');
  }

  @Post('publish')
  async publish(@Body() body: SendToQueueDto) {
    return this.rabbitMqService.publish('rabbitmq', body.queue, JSON.stringify(body.content));
  }

  @Post('send-to-queue')
  async sendToQueue(@Body() body: SendToQueueDto) {
    return this.rabbitMqService.sendToQueue(
      body.queue,
      JSON.stringify(body.content),
      body.options || {}
    );
  }

  @Get('health')
  async health() {
    return this.rabbitMqService.healthCheck();
  }

  @Get('queues/:queue/stats')
  async queueStats(@Param('queue') queue: string) {
    return this.rabbitMqService.getQueueStats(queue);
  }

  @Delete('queues/:queue')
  async deleteQueue(@Param('queue') queue: string) {
    return this.rabbitMqService.deleteQueue(queue);
  }
}
