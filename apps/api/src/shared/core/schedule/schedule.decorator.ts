import { SetMetadata } from '@nestjs/common';
import { JobsOptions } from 'bullmq';

export const SCHEDULE_JOB_HANDLER = 'SCHEDULE_JOB_HANDLER';
export const SCHEDULE_JOB_METADATA = 'SCHEDULE_JOB_METADATA';

export type ScheduleJobDefinition = {
  name: string;
  jobId?: string;
  cron?: string;
  every?: number;
  data?: any;
  opts?: JobsOptions;
  autoStart?: boolean;
};

const scheduleJobRegistry = new Map<string, ScheduleJobDefinition>();

export const ScheduleJob =
  (definition: Omit<ScheduleJobDefinition, 'name'> & { name?: string }): MethodDecorator =>
  (target, propertyKey, descriptor) => {
    const name = definition.name || String(propertyKey);
    const stored: ScheduleJobDefinition = {
      ...definition,
      name,
    };
    scheduleJobRegistry.set(name, stored);
    SetMetadata(SCHEDULE_JOB_HANDLER, name)(target, propertyKey, descriptor);
    SetMetadata(SCHEDULE_JOB_METADATA, definition)(target, propertyKey, descriptor);
  };

export function getRegisteredScheduleJobs(): ScheduleJobDefinition[] {
  return Array.from(scheduleJobRegistry.values());
}

export function getScheduleJobHandlerMap(instance: Record<string, any>) {
  const handlers = new Map<string, (...args: any[]) => any>();
  const prototype = Object.getPrototypeOf(instance);
  for (const key of Object.getOwnPropertyNames(prototype)) {
    if (key === 'constructor') {
      continue;
    }
    const name = Reflect.getMetadata(SCHEDULE_JOB_HANDLER, prototype, key);
    if (name) {
      handlers.set(name, instance[key].bind(instance));
    }
  }
  return handlers;
}
