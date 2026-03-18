import { Inject, Logger } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { ResponsePayload } from '../../interfaces/response.interface';

export class NatsClientService {
  private readonly logger = new Logger(NatsClientService.name);
  constructor(@Inject('NATS_CLIENT_SERVICE') private readonly natsClient: ClientNats) {}

  async send(pattern: string, data: any): Promise<ResponsePayload<any>> {
    const request = this.natsClient.send(pattern, data);
    this.logger.log(`Sending NATS message - Pattern: ${pattern}, Data: ${JSON.stringify(data)}`);
    return await firstValueFrom(request);
  }
}
