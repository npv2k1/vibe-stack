import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '../common/base.repository';
import { ScheduleJob } from '../models/schedule-job.model';

export class ScheduleJobRepository extends BaseRepository<ScheduleJob> {
  constructor(
    @InjectModel(ScheduleJob.name)
    model: Model<ScheduleJob>
  ) {
    super(model);
  }
}
