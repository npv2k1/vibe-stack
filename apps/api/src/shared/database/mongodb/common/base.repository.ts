import { Document, QueryFilter, Model, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(doc: Partial<Omit<T, keyof Document>>): Promise<T> {
    return this.model.create(doc as any);
  }

  async findAll(filter: QueryFilter<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async count(filter: QueryFilter<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: QueryFilter<T>): Promise<boolean> {
    return this.model.exists(filter).then((res) => !!res);
  }

  // aggregate
  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.model.aggregate(pipeline).exec();
  }

  async findPaginated(
    filter: QueryFilter<T> = {},
    page: number = 1,
    limit: number = 10,
  ) {
    const total = await this.count(filter);
    const data = await this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return {
      items: data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async upsert(filter: QueryFilter<T>, update: UpdateQuery<T>): Promise<T> {
    return this.model
      .findOneAndUpdate(filter, update, {
        new: true, // return the updated document
        upsert: true, // create if not exists
      })
      .exec();
  }

  async insertMany(
    docs: Array<Partial<Omit<T, keyof Document>>>,
  ): Promise<T[]> {
    return (await this.model.insertMany(docs)) as any;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    const result = await this.model
      .deleteMany({ _id: { $in: ids } } as QueryFilter<T>)
      .exec();
    return result.acknowledged;
  }

  getPrimaryKey(): string {
    return '_id';
  }

  getRelation() {
    return {};
  }
}
