/* eslint-disable */

import { BadRequestException } from '@nestjs/common';
import { Document, UpdateQuery } from 'mongoose';

import { FindManyDto } from '@/shared/common/base.dto';
import { IBaseService } from '@/shared/common/base.services';

import { BaseRepository } from './base.repository';

export abstract class BaseServiceMongoAbstract<
  T = any,
> implements IBaseService<T> {
  constructor(protected readonly repo: BaseRepository<T>) {}

  async getSearch(query: FindManyDto): Promise<any> {
    return {};
  }

  async findAll(request: FindManyDto): Promise<T[]> {
    const search = await this.getSearch(request);
    return await this.repo.findAll({ ...request.filter, ...search });
  }

  async findOne(id: string): Promise<T> {
    return (
      (await this.repo.findOne({
        _id: id,
      })) ?? ({} as T)
    );
  }
  async create(data: Partial<Omit<T, keyof Document>>): Promise<T> {
    return await this.repo.create(data);
  }

  async insertMany(
    data: Array<Partial<Omit<T, keyof Document>>>,
  ): Promise<T[]> {
    return await this.repo.insertMany(data);
  }
  async updateOne(id: string, data: Partial<T>): Promise<T> {
    return this.repo.update(id, data) as Promise<T>;
  }

  async updateMany(data: Partial<T>[]): Promise<T[]> {
    const pk = this.getPrimaryKey();
    return Promise.all(
      data.map((item: any) => {
        return this.repo.update(item[pk], item);
      }),
    ) as Promise<T[]>;
  }

  async deleteOne(id: string): Promise<{ success: boolean }> {
    await this.repo.delete(id);
    return { success: true };
  }

  async deleteMany(ids: string[]): Promise<{ success: boolean }> {
    const success = await this.repo.deleteMany(ids);
    return { success };
  }

  async upsertOne(data: T): Promise<{ success: boolean }> {
    const pk = this.getPrimaryKey();
    const id = (data as any)[pk];
    if (!id) {
      throw new BadRequestException('Missing primary key');
    }
    await this.repo.upsert({ [pk]: id } as any, data as any);
    return { success: true };
  }

  async findPaginated(request: FindManyDto) {
    const { page, limit, filter } = request;

    const search = await this.getSearch(request);

    return this.repo.findPaginated(
      {
        ...filter,
        ...search,
      },
      page,
      limit,
    );
  }

  async upsert(filter: any, update: UpdateQuery<T>): Promise<T> {
    return this.repo.upsert(filter, update);
  }

  getPrimaryKey(): string {
    return '_id';
  }

  getRelation() {
    return {};
  }
}
