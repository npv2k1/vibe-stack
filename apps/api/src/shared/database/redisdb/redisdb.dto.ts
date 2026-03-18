import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SetRedisDto {
  @ApiProperty({ description: 'The key to set in Redis' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ description: 'The value to store in Redis' })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiPropertyOptional({ description: 'Expiration time in seconds' })
  @IsOptional()
  @IsNumber()
  expireSeconds?: number;
}
