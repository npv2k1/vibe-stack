import { BadRequestException } from '@nestjs/common';

import { UserEntity } from '../interfaces/user.interface';

import { FindManyDto, FindManyResponseDto } from './base.dto';

export interface IBaseService<T> {
  findAll(request: FindManyDto, user?: any): Promise<T[]>;
  findOne(id: string): Promise<T>;
  create(data: T, user?: any): Promise<T>;
  insertMany(data: T[]): Promise<T[]>;
  updateOne(id: string, data: Partial<T>): Promise<T>;
  updateMany(data: Partial<T>[]): Promise<T[]>;
  deleteOne(id: string): Promise<{ success: boolean }>;
  deleteMany(ids: string[]): Promise<{ success: boolean }>;
  upsertOne(data: T): Promise<{ success: boolean }>;
}

export abstract class BaseServiceAbstract<T = any> implements IBaseService<T> {
  constructor(protected readonly model: any) {}

  getSearch(query: FindManyDto) {
    // return prisma condiction for search
    return {};
  }

  createEntity(data: any): T {
    return data as T;
  }

  getPrimaryKey(): string {
    return 'id';
  }

  getUserForeignKey(): string {
    return 'userId';
  }

  getRelation() {
    return {};
  }

  private buildUserCondition(user?: UserEntity) {
    if (user && user.id) {
      return { [this.getUserForeignKey()]: user.id };
    }
    return {};
  }

  private buildUserData(data: any, user?: UserEntity) {
    if (user && user.id) {
      return { ...data, [this.getUserForeignKey()]: user.id };
    }
    return data;
  }

  async findAll(request: FindManyDto, user?: any): Promise<T[]> {
    return this.model.findMany({});
  }

  async findOne(id: string, user?: UserEntity): Promise<T> {
    const relation = this.getRelation();

    return this.model.findUnique({
      where: {
        [this.getPrimaryKey()]: id,
        // ...this.buildUserCondition(user),
      },
      include: relation,
    });
  }

  async insertMany(data: T[]): Promise<T[]> {
    await this.model.createMany({ data });
    return data;
  }

  async updateOne(id: string, data: Partial<T>): Promise<T> {
    return this.model.update({ where: { [this.getPrimaryKey()]: id }, data });
  }

  async updateMany(data: Partial<T>[]): Promise<T[]> {
    // Assumes each item in data has an 'id' property
    return Promise.all(
      data.map((item: any) =>
        this.model.update({ where: { id: item.id }, data: item }),
      ),
    );
  }

  async deleteOne(id: string): Promise<{ success: boolean }> {
    await this.model.delete({ where: { [this.getPrimaryKey()]: id } });
    return { success: true };
  }

  async deleteMany(ids: string[]): Promise<{ success: boolean }> {
    await this.model.deleteMany({ where: { id: { in: ids } } });
    return { success: true };
  }

  async upsertOne(data: T): Promise<{ success: boolean }> {
    if (!data[this.getPrimaryKey()]) {
      throw new BadRequestException('Missing primary key');
    }
    await this.model.upsert({
      where: { [this.getPrimaryKey()]: data[this.getPrimaryKey()] },
      update: data,
      create: data,
    });
    return { success: true };
  }

  async findPaginated(
    query: FindManyDto,
    user: UserEntity,
  ): Promise<FindManyResponseDto<T>> {
    const condiction: any = {};
    const relation = this.getRelation();

    if (user && user.id) {
      condiction.where = { [this.getUserForeignKey()]: user.id };
    }

    if (relation) {
      condiction.include = relation;
    }

    if (query.page && query.limit) {
      condiction.skip = (query.page - 1) * query.limit;
      condiction.take = query.limit;
    }
    if (query.filter) {
      condiction.where = query.filter;
    }

    condiction.where = {
      ...condiction.where,
      ...this.getSearch(query),
    };

    const [items, total] = await Promise.all([
      this.model.findMany(condiction),
      this.model.count({
        where: condiction.where,
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page: query.page ?? -1,
        limit: query.limit ?? 10,
        pages: Math.ceil(total / (query.limit ?? 10)),
      },
    };
  }

  async create(data: any): Promise<T> {
    const createEntity = await this.createEntity(data);
    return await this.model.create({ data: createEntity });
  }

  async upsert(data: any) {
    return await this.model.upsert(data);
  }

  async findMany(args: any) {
    return await this.model.findMany(args);
  }

  async findUnique(args: any) {
    return await this.model.findUnique(args);
  }

  async aggregate(args: any) {
    return await this.model.aggregate(args);
  }

  async groupBy(args: any) {
    return await this.model.groupBy(args);
  }

  async update(args: any) {
    return await this.model.update(args);
  }

  async delete(args: any) {
    return await this.model.delete(args);
  }

  async count(args: any) {
    return await this.model.count(args);
  }
}
