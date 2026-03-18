import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';

import { ScheduleProcessor } from './processor/schedule.processor';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Global()
@Module({
  controllers: [ScheduleController],
  imports: [
    NestScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        username: process.env.REDIS_USERNAME || '',
        password: process.env.REDIS_PASSWORD || '',
      },
    }),
    BullModule.registerQueue({
      name: 'jobs',
    }),
  ],
  providers: [ScheduleService, ScheduleProcessor],
  exports: [ScheduleService, ScheduleProcessor],
})
export class ScheduleModule {}
