import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { KafkaController } from './kafka.controller';
import { KafkaGateway } from './kafka.gateway';
import { KafkaService } from './kafka.service';

@Module({
  controllers: [KafkaController],
  imports: [ConfigModule],
  providers: [KafkaService, KafkaGateway],
  exports: [KafkaService],
})
export class KafkaModule {}
