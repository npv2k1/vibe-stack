import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { NatsService } from './nat.service';
import { NatsClientService } from './nats.client.service';

@Global()
@Module({
  providers: [
    NatsService,
    {
      provide: 'NATS_CLIENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const natsConfig = configService.get<{ servers: string[] }>('nats');
        return ClientProxyFactory.create({
          transport: Transport.NATS,
          options: {
            servers: natsConfig?.servers || ['nats://localhost:4222'],
          },
        });
      },
      inject: [ConfigService],
    },
    NatsClientService,
  ],
  exports: [NatsService, NatsClientService],
})
export class NatsModule {}
