import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EdgeEntity } from './common/base.neo4j.repository';
import { User } from './models/user.entity';
import { UserRepository } from './repositories/user.repository';

@ApiTags('Neo4j')
@Controller('neo4j')
export class Neo4jController {
  constructor(private readonly repository: UserRepository) {}

  @Post()
  async create(@Body() dto: User) {
    return this.repository.create(dto);
  }

  @Post('edge')
  async createEdge(@Body() dto: EdgeEntity) {
    return this.repository.createEdge(dto);
  }

  @Get()
  async findAll() {
    return this.repository.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.repository.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<User>) {
    return this.repository.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.repository.delete(id);
  }
}
