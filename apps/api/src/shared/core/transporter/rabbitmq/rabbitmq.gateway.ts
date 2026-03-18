import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { SocketBaseGateway } from '@/shared/core/socket/socket-base.gateway';

import { RabbitMqService } from './rabbitmq.service';

const socketPort = parseInt(process.env.SOCKET_PORT || '4001');

@WebSocketGateway(socketPort, {
  namespace: 'rabbitmq',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class RabbitMqGateway
  extends SocketBaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(private readonly rabbitMqService: RabbitMqService) {
    super();
  }
  onModuleInit() {
    console.log('ws://localhost:' + socketPort + '/rabbitmq');
  }

  @SubscribeMessage('subscrible')
  async subscrible(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    await this.rabbitMqService.bindQueue(client.id, 'rabbitmq', body.queue);
    await this.rabbitMqService.consume(client.id, async (msg) => {
      console.log('message', msg.content);
      this.emitToClient(client, body.queue, JSON.parse(msg.content.toString()));
    });
  }
}
