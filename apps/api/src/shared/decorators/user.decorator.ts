import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserEntity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext().req.user
);

export const ReqUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  if (ctx.getType() === 'http') {
    // If the context is HTTP, use switchToHttp
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  } else {
    // If the context is GraphQL, use GqlExecutionContext
    return GqlExecutionContext.create(ctx).getContext().req.user;
  }
});
