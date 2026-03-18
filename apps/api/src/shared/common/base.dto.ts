import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { UserEntity } from '../interfaces/user.interface';

export class BaseDto {
  userId?: string;
  lang?: string;
  user?: UserEntity;
}

export class FindManyDto extends BaseDto {
  @IsOptional()
  @ApiProperty()
  @Type(() => String)
  search?: string;

  @IsOptional()
  @ApiProperty({
    default: 1,
  })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @ApiProperty({
    default: 20,
  })
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  filter: any;

  @ApiProperty()
  sort: any;

  get take(): number {
    const limit = Number(this.limit) || 10;
    return limit > 0 && limit <= 1000 ? limit : 10;
  }

  get skip(): number {
    const page = (Number(this.page) || 1) - 1;
    return (page < 0 ? 0 : page) * this.take;
  }

  getTake(): number {
    const limit = Number(this.limit) || 10;
    return limit > 0 && limit <= 1000 ? limit : 10;
  }

  getSkip(): number {
    const page = (Number(this.page) || 1) - 1;
    return (page < 0 ? 0 : page) * this.take;
  }
}

export class FindManyResponseDto<T> {
  @ApiProperty({ type: [Object] })
  items: T[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export enum EnumSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class Sort {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(EnumSort)
  order: any;
}

export class Filter {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}
