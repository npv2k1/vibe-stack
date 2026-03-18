import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RootResolver {
  @Query(() => Boolean)
  health(): boolean {
    return true;
  }
}
