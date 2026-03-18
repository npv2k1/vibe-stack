import { Processor, WorkerHost } from '@nestjs/bullmq';
import { OnModuleInit } from '@nestjs/common';
import { Job } from 'bullmq';

import { ScheduleService } from '../schedule.service';

@Processor('jobs')
export class ScheduleProcessor extends WorkerHost implements OnModuleInit {
  constructor(private readonly scheduleService: ScheduleService) {
    super();
  }

  onModuleInit() {
    console.log('Schedule processor');
  }

  async process(job: Job): Promise<any> {
    return await this.scheduleService.executeJob(job);
  }
}
