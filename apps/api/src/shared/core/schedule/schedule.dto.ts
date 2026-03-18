import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateScheduleJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  jobId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cron?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  every?: number;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  data?: any;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  opts?: any;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  autoStart?: boolean;
}

export class UpdateScheduleJobDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  jobId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cron?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  every?: number;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  data?: any;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  opts?: any;
}

export class DeleteScheduleJobDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  jobId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}

export class JobStatusQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  jobId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}
