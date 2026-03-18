import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScheduleJob, ScheduleJobSchema } from './models/schedule-job.model';
import { ScheduleJobRepository } from './repositories/schedule-job.repository';
import { MongodbConfig } from './mongodb.config';
import { MongodbController } from './mongodb.controller';
import { MongodbService } from './mongodb.service';

@Global()
@Module({
  controllers: [MongodbController],
  imports: [
    MongooseModule.forRootAsync({ useClass: MongodbConfig }),
    MongooseModule.forFeature([{ name: ScheduleJob.name, schema: ScheduleJobSchema }]),
  ],
  providers: [MongodbService, ScheduleJobRepository],
  exports: [MongodbService, ScheduleJobRepository],
})
export class MongodbModule {}
