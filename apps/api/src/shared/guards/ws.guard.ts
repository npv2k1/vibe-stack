import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { NatsClientService } from '@/shared/core/transporter/nats/nats.client.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly natsClientService: NatsClientService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const authToken = client.handshake.headers?.authorization;

    if (!authToken) {
      client.emit('disconnected', new WsException('Unauthorized'));
      // client.disconnect(true);
      throw new WsException('Invalid token');
    }
    const accessToken = authToken.split(' ')[1];
    const verifyTokenResponse = await this.natsClientService.send(
      'auth-service.validate-user',
      {
        accessToken: accessToken,
      },
    );

    const user = verifyTokenResponse.data;
    context.switchToHttp().getRequest().user = user;
    return true;
  }
}
