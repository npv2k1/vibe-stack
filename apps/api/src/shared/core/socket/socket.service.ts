import { Injectable } from '@nestjs/common';

import { RxjsPubsubService } from '../rxjs-pubsub/rxjs-pubsub.service';

@Injectable()
export class SocketService {
  socket: any;
  constructor(private readonly rxjsPubsubService: RxjsPubsubService) {
    this.handleListen();
  }

  async handleListen() {
    this.rxjsPubsubService.subscribe('register').subscribe((data) => {
      console.log('rxjsPubsubService', data);
      this.register(data.clientId, data.listSymbol);
    });
    this.rxjsPubsubService.publish('register:response', {
      response: 'ok',
    });
  }

  async register(clientId: string, data: any) {}
}
