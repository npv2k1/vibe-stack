// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { PubSubService } from '@/shared/graphql/pub-sub/pubsub.service';

@Injectable()
export abstract class BaseService<TModel extends keyof PrismaClient> {
  public model: PrismaClient[TModel];
  public prisma: PrismaClient;
  public pubSubService: PubSubService;

  constructor(public prisma: PrismaClient, name?: TModel, public pubSubService?: PubSubService) {
    this.prisma = prisma;
    this.model = prisma[name];

    this.pubSubService = pubSubService;
  }

  // Find
  findFirst: PrismaClient[TModel]['findFirst'] = (args) => {
    return this.model.findFirst(args);
  };
  findFirstOrThrow: PrismaClient[TModel]['findFirstOrThrow'] = (args) => {
    return this.model.findFirstOrThrow(args);
  };

  findUnique: PrismaClient[TModel]['findUnique'] = (args) => {
    return this.model.findUnique(args);
  };
  findUniqueOrThrow: PrismaClient[TModel]['findUniqueOrThrow'] = (args) => {
    return this.model.findUniqueOrThrow(args);
  };

  findMany: PrismaClient[TModel]['findMany'] = (args) => {
    return this.model.findMany(args);
  };

  // Create
  create: PrismaClient[TModel]['create'] = async (args) => {
    const res = await this.model.create(args);
    return res;
  };

  createMany: PrismaClient[TModel]['createMany'] = async (args) => {
    return this.model.createMany(args);
  };

  // Update
  update: PrismaClient[TModel]['update'] = (args) => {
    return this.model.update(args);
  };
  upsert: PrismaClient[TModel]['upsert'] = (args) => {
    return this.model.upsert(args);
  };
  updateMany: PrismaClient[TModel]['updateMany'] = (args) => {
    return this.model.updateMany(args);
  };
  // Delete
  delete: PrismaClient[TModel]['delete'] = (args) => {
    return this.model.delete(args);
  };
  deleteMany: PrismaClient[TModel]['deleteMany'] = (args) => {
    return this.model.deleteMany(args);
  };

  // Aggregate
  aggregate: PrismaClient[TModel]['aggregate'] = (args) => {
    return this.model.aggregate(args);
  };

  // Count
  count: PrismaClient[TModel]['count'] = (args) => {
    return this.model.count(args);
  };

  // GroupBy
  groupBy: PrismaClient[TModel]['groupBy'] = (args) => {
    return this.model.groupBy(args);
  };
}
