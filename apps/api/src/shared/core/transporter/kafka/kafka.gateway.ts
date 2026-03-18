import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { SocketBaseGateway } from '@/shared/core/socket/socket-base.gateway';

import { KafkaService } from './kafka.service';

const socketPort = parseInt(process.env.SOCKET_PORT || '4001');

@WebSocketGateway(socketPort, {
  namespace: 'kafka',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class KafkaGateway
  extends SocketBaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(private readonly kafkaService: KafkaService) {
    super();
  }
  onModuleInit() {
    console.log('ws://localhost:' + socketPort + '/kafka');
  }

  @SubscribeMessage('subscrible')
  async subscrible(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('KafkaGateway subscrible', body);
    await this.kafkaService.subscribe(
      body.queue,
      async (msg, partition, offset) => {
        console.log('message', body.queue, msg, partition, offset);
        return this.emitToClient(client, body.queue, msg);
      },
      {
        groupId: `${body.queue}_${client.id}`,
      },
    );
  }
}
