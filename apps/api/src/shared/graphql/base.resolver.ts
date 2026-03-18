import { Type as NestjsType } from '@nestjs/common';
import { Args, ArgsType, Field, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import pluralize from 'pluralize';
@ObjectType({
  isAbstract: true,
})
export class UpdateManyResponse {
  @Field(() => Int)
  count: number;
}

export function BaseResolver<T, CT, ET, UT>(
  Entity: NestjsType<T>,
  EntityInput: NestjsType<CT>,
  EntityQueryInput: NestjsType<ET>,
  EntityUpdateInput: NestjsType<UT>
): any {
  @ArgsType()
  class InsertOneInput {
    @Field(() => EntityInput)
    data!: CT;
  }

  @ArgsType()
  class InsertManyInput {
    @Field(() => [EntityInput])
    data!: CT[];
  }

  @ArgsType()
  class FindManyInput {
    @Field(() => EntityQueryInput, { nullable: true })
    query?: ET;
  }

  @ArgsType()
  class FindOneInput {
    @Field(() => String)
    id: string;
  }

  @ArgsType()
  class UpdateOneInput extends FindOneInput {
    @Field(() => EntityUpdateInput)
    data: UT;
  }

  @ArgsType()
  class UpdateManyInput extends FindManyInput {
    @Field(() => EntityUpdateInput)
    data: UT;
  }

  @Resolver(() => Entity, { isAbstract: true })
  abstract class CrudResolver {
    constructor(public readonly service: any) {}

    @Mutation(() => Entity, { name: `insertOne${pluralize.singular(Entity.name)}` })
    async insertOne(@Args() args: InsertOneInput) {
      return this.service.create({ data: args.data });
    }

    @Mutation(() => UpdateManyResponse, { name: `insertMany${pluralize.plural(Entity.name)}` })
    async insertMany(@Args() args: InsertManyInput) {
      return this.service.createMany({ data: args.data });
    }

    @Query(() => [Entity], { name: `${pluralize.plural(Entity.name.toLowerCase())}` })
    async findMany(@Args() args: FindManyInput) {
      return this.service.findMany({ where: args.query });
    }

    @Query(() => Entity, { name: Entity.name.toLowerCase() })
    async findOne(@Args() args: FindOneInput) {
      return this.service.findUnique({ where: { id: args.id } });
    }

    @Mutation(() => Entity, { name: `updateOne${pluralize.singular(Entity.name)}` })
    async updateOne(@Args() args: UpdateOneInput) {
      return this.service.update({ where: { id: args.id }, data: args.data });
    }

    @Mutation(() => UpdateManyResponse, { name: `updateMany${pluralize.plural(Entity.name)}` })
    async updateMany(@Args() args: UpdateManyInput) {
      return this.service.updateMany({ where: args.query, data: args.data });
    }

    @Mutation(() => Entity, { name: `deleteOne${pluralize.singular(Entity.name)}` })
    async deleteOne(@Args() args: FindOneInput) {
      return this.service.delete({ where: { id: args.id } });
    }

    @Mutation(() => [Entity], {
      name: `deleteMany${pluralize.plural(Entity.name)}`,
    })
    async deleteMany(@Args() args: FindManyInput) {
      return await this.service.deleteMany({ where: args.query });
    }
  }

  return CrudResolver;
}
