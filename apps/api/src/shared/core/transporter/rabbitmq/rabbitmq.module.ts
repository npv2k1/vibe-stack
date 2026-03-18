import { Global, Module } from '@nestjs/common';

import { RabbitMqController } from './rabbitmq.controller';
import { RabbitMqGateway } from './rabbitmq.gateway';
import { RabbitMqService } from './rabbitmq.service';

@Global()
@Module({
  controllers: [RabbitMqController],
  providers: [RabbitMqService, RabbitMqGateway],
  exports: [RabbitMqService, RabbitMqGateway],
})
export class RabbitMqModule {}
