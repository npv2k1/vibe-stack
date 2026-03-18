import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Job, JobsOptions, Queue, RepeatOptions } from 'bullmq';

import { ScheduleJobRepository } from '@/shared/database/mongodb/repositories/schedule-job.repository';

import {
  getRegisteredScheduleJobs,
  getScheduleJobHandlerMap,
  ScheduleJobDefinition,
} from './schedule.decorator';

export type CreateScheduleJobInput = {
  name: string;
  jobId?: string;
  cron?: string;
  every?: number;
  data?: any;
  opts?: JobsOptions;
  autoStart?: boolean;
};

export type UpdateScheduleJobInput = {
  jobId?: string;
  name?: string;
  cron?: string;
  every?: number;
  data?: any;
  opts?: JobsOptions;
};

export type ScheduleJobSelector = {
  jobId?: string;
  name?: string;
};

@Injectable()
export class ScheduleService implements OnModuleInit, OnModuleDestroy {
  private handlerMap = new Map<
    string,
    (payload: any, job: Job) => Promise<any>
  >();

  constructor(@InjectQueue('jobs') private queue: Queue) {}

  async onModuleDestroy() {}

  async onModuleInit() {
    this.handlerMap = getScheduleJobHandlerMap(this);
    await this.registerDecoratedJobs();
  }

  async clean() {
    return await this.queue.obliterate({ force: true });
  }

  async listJobs() {
    const jobs = await this.queue.getJobs([
      'active',
      'completed',
      'delayed',
      'failed',
      'paused',
      'waiting',
    ]);
    const repeatables = await this.queue.getRepeatableJobs();
    return {
      jobs: jobs.map((job) => job.toJSON()),
      repeatables,
    };
  }

  async addJob(input: CreateScheduleJobInput) {
    return await this.registerJob(input);
  }

  async updateJob(input: UpdateScheduleJobInput) {
    const name = input.name || input.jobId;
    if (!name) {
      throw new Error('Job name or jobId is required');
    }

    await this.removeRepeatablesByName(name);

    const jobId = input.jobId || name;
    const repeat = this.normalizeRepeat(input);
    const job = await this.queue.add(name, input.data ?? {}, {
      jobId,
      ...(input.opts || {}),
      repeat,
    });
  }

  async deleteJob(selector: ScheduleJobSelector) {
    if (!selector.jobId && !selector.name) {
      throw new Error('Job name or jobId is required');
    }

    if (selector.name) {
      await this.removeRepeatablesByName(selector.name);
    }

    if (selector.jobId) {
      const job = await this.queue.getJob(selector.jobId);
      if (job) {
        await job.remove();
      }
    }

    return {
      deleted: true,
    };
  }

  async getJobStatus(selector: ScheduleJobSelector) {
    if (!selector.jobId && !selector.name) {
      throw new Error('Job name or jobId is required');
    }

    const job = selector.jobId ? await this.queue.getJob(selector.jobId) : null;
    const repeatables = selector.name
      ? (await this.queue.getRepeatableJobs()).filter(
          (item) => item.name === selector.name,
        )
      : [];

    return {
      job: job ? job.toJSON() : null,
      repeatables,
    };
  }

  async updateJobTime(jobId: string, cron: string) {
    return await this.updateJob({ jobId, cron });
  }

  async executeJob(job: Job) {
    const handler = this.handlerMap.get(job.name);
    if (!handler) {
      return;
    }
    await handler(job.data, job);
  }

  private async registerDecoratedJobs() {
    const definitions = getRegisteredScheduleJobs();
    for (const definition of definitions) {
      if (definition.autoStart === false) {
        continue;
      }
      await this.registerJob(definition);
    }
  }

  private async registerJob(
    definition: ScheduleJobDefinition | CreateScheduleJobInput,
  ) {
    const jobId = definition.jobId || definition.name;
    const repeat = this.normalizeRepeat(definition);
    const job = await this.queue.add(definition.name, definition.data ?? {}, {
      jobId,
      ...(definition.opts || {}),
      repeat,
    });
  }

  private normalizeRepeat(input: {
    cron?: string;
    every?: number;
  }): RepeatOptions | undefined {
    if (input.cron) {
      return { pattern: input.cron };
    }
    if (input.every) {
      return { every: input.every };
    }
    return undefined;
  }

  private async removeRepeatablesByName(name: string) {
    const repeatables = await this.queue.getRepeatableJobs();
    for (const repeatable of repeatables) {
      if (repeatable.name === name) {
        await this.queue.removeRepeatableByKey(repeatable.key);
      }
    }
  }
}
