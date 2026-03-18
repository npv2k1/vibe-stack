import { Body, Controller, Delete, Get, OnModuleInit, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  CreateScheduleJobDto,
  DeleteScheduleJobDto,
  JobStatusQueryDto,
  UpdateScheduleJobDto,
} from './schedule.dto';
import { ScheduleService } from './schedule.service';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController implements OnModuleInit {
  onModuleInit() {}
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: 'Add job' })
  @ApiResponse({ status: 201, description: 'Add job' })
  @Post('add')
  async addJob(@Body() dto: CreateScheduleJobDto) {
    return await this.scheduleService.addJob(dto);
  }

  @ApiOperation({ summary: 'Update job' })
  @ApiResponse({ status: 200, description: 'Update job' })
  @Put('update')
  async updateJob(@Body() dto: UpdateScheduleJobDto) {
    return await this.scheduleService.updateJob(dto);
  }

  @ApiOperation({ summary: 'Delete job' })
  @ApiResponse({ status: 200, description: 'Delete job' })
  @Delete('delete')
  async deleteJob(@Body() dto: DeleteScheduleJobDto) {
    return await this.scheduleService.deleteJob(dto);
  }

  @ApiOperation({ summary: 'Get job status' })
  @ApiResponse({ status: 200, description: 'Get job status' })
  @Get('status')
  async getStatus(@Query() query: JobStatusQueryDto) {
    return await this.scheduleService.getJobStatus(query);
  }

  @ApiOperation({ summary: 'List jobs' })
  @ApiResponse({ status: 200, description: 'List jobs' })
  @Get('jobs')
  async listJobs() {
    return await this.scheduleService.listJobs();
  }

  @ApiOperation({ summary: 'Clean jobs' })
  @ApiResponse({ status: 200, description: 'Clean jobs' })
  @Post('clean')
  async clean() {
    return await this.scheduleService.clean();
  }
}
