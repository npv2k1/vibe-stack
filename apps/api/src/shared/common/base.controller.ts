import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Type } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ReqUser } from '@/shared/decorators/user.decorator';

import { FindManyDto, FindManyResponseDto } from './base.dto';
import { BaseServiceAbstract } from './base.services';

export function baseControllerFactory<T>(Entity: Type<T>, routePrefix?: string): any {
  const basePath = routePrefix || Entity.name.toLowerCase();

  @Controller(basePath)
  @ApiTags(basePath)
  abstract class BaseController {
    constructor(protected readonly service: BaseServiceAbstract<T>) {}

    @Get('list')
    @ApiOperation({ summary: `Get all ${Entity.name}` })
    @ApiResponse({ status: 200, type: FindManyResponseDto<T> })
    async list(@Query() query: FindManyDto, @ReqUser() user: any): Promise<FindManyResponseDto<T>> {
      return this.service.findAll(query, user) as any;
    }

    @Get()
    @ApiOperation({ summary: `Get all ${Entity.name}` })
    @ApiResponse({ status: 200, type: FindManyResponseDto<T> })
    async findAll(
      @Query() query: FindManyDto,
      @ReqUser() user: any
    ): Promise<FindManyResponseDto<T>> {
      return this.service.findPaginated(query, user) as any;
    }

    @Get(':id')
    @ApiOperation({ summary: `Get ${Entity.name} by ID` })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, type: Entity })
    async findOne(@Param('id') id: string, @ReqUser() user: any): Promise<T> {
      return this.service.findOne(id, user);
    }

    @Post()
    @ApiOperation({ summary: `Create ${Entity.name}` })
    @ApiBody({ type: Entity })
    @ApiResponse({ status: 201, type: Entity })
    async create(@Body() body: T, @ReqUser() user: any): Promise<T> {
      void user;
      return this.service.create(body);
    }

    @Post('create-many')
    @ApiOperation({ summary: `Insert many ${Entity.name}` })
    @ApiBody({ type: [Entity] })
    @ApiResponse({ status: 201, type: [Entity] })
    async insertMany(@Body() body: T[]): Promise<T[]> {
      return this.service.insertMany(body);
    }

    @Put(':id')
    @ApiOperation({ summary: `Update ${Entity.name} by ID` })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ type: Entity })
    @ApiResponse({ status: 200, type: Entity })
    async updateOne(@Param('id') id: string, @Body() body: Partial<T>): Promise<T> {
      return this.service.updateOne(id, body);
    }

    @Put('update-many')
    @ApiOperation({ summary: `Update many ${Entity.name}` })
    @ApiBody({ type: [Entity] })
    @ApiResponse({ status: 200, type: [Entity] })
    async updateMany(@Body() body: Partial<T>[]): Promise<T[]> {
      return this.service.updateMany(body);
    }

    @Delete(':id')
    @ApiOperation({ summary: `Delete ${Entity.name} by ID` })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200 })
    async deleteOne(@Param('id') id: string): Promise<{ success: boolean }> {
      return this.service.deleteOne(id);
    }

    @Delete('delete-many')
    @ApiOperation({ summary: `Delete many ${Entity.name}` })
    @ApiBody({ type: [String] })
    @ApiResponse({ status: 200 })
    async deleteMany(@Body() ids: string[]): Promise<{ success: boolean }> {
      return this.service.deleteMany(ids);
    }

    @Post('upsert')
    @ApiOperation({ summary: `Upsert one ${Entity.name}` })
    @ApiBody({ type: Entity })
    @ApiResponse({ status: 200 })
    async upsertOne(@Body() body: T): Promise<{ success: boolean }> {
      return this.service.upsertOne(body);
    }
  }

  return BaseController;
}
