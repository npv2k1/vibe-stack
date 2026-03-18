import { Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseModel } from '../common/base.model';

@Schema({
  strict: false, // Allow additional properties
})
export class ScheduleJob extends BaseModel {}

export const ScheduleJobSchema = SchemaFactory.createForClass(ScheduleJob);
