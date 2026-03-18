import { OnModuleInit, UseGuards } from '@nestjs/common';
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

import { WsGuard } from '@/shared/guards/ws.guard';
import { ReqUser } from '@/shared/decorators/user.decorator';

import { RxjsPubsubService } from '../rxjs-pubsub/rxjs-pubsub.service';

import { OnEventMessage } from './socket.decorator';
import { SocketService } from './socket.service';
import { SocketBaseGateway } from './socket-base.gateway';

const socketPort = parseInt(process.env.SOCKET_PORT || '4001');

@WebSocketGateway(socketPort, {
  namespace: '',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  extends SocketBaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  declare server: Server;

  clientIds: string[];
  constructor(
    private readonly socketService: SocketService,
    private readonly rxjsPubsubService: RxjsPubsubService,
  ) {
    super();
  }

  onModuleInit() {
    console.log('ws://localhost:' + socketPort);
  }

  @OnEventMessage('ping')
  ping(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    return body;

    this.sendToClient(client.id, 'pong', body);
    this.sendToAllClients('pong', body);
  }

  @SubscribeMessage('time')
  streamServerTime() {
    /* The commented code is using the `setInterval` function to emit the current server time to all
   connected clients every 1 second. */
    setInterval(() => {
      this.response('time', new Date().toString());
    }, 1000);
  }

  @SubscribeMessage('offer')
  handleOffer(
    @MessageBody() data: { roomId: string; offer: any; toId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { offer, toId } = data;
    console.log('handleOffer', data);
    // Emit the offer to the target client
    this.toSocketId(toId, 'offer', {
      offer,
      senderId: client.id,
    });
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @MessageBody() data: { roomId: string; answer: any; toId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { answer, toId } = data;

    this.toSocketId(toId, 'answer', {
      answer,
      senderId: client.id,
    });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @MessageBody()
    data: {
      roomId: string;
      candidate: any;
      targetId: string;
      senderId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { candidate, targetId } = data;

    console.log('handleIceCandidate', data);

    client.to(targetId).emit('ice-candidate', { candidate, fromId: client.id });
  }

  @SubscribeMessage('send-to-socket-id')
  sendToSocketId(
    @MessageBody() data: { toId: string; payload: any; event: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { toId, payload, event } = data;

    this.toSocketId(toId, event, {
      ...payload,
      senderId: client.id,
    });
  }

  @SubscribeMessage('send-to-all')
  sendToAll(@MessageBody() data: any) {
    this.sendToAllClients(data.event, {
      ...data.payload,
      senderId: data.senderId,
    });
  }

  @OnEventMessage('me')
  @UseGuards(WsGuard)
  me(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
    @ReqUser() user: any,
  ) {
    return { body, user }; // Client must enable ACK to receive response
  }
}
