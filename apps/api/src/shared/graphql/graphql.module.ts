import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';

import { PubSubModule } from './pub-sub/pubsub.module';
import { PubSubService } from './pub-sub/pubsub.service';
import { GqlConfigService } from './gql-config.service';
import { RootResolver } from './root.resolver';

@Global()
@Module({
  imports: [
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    PubSubModule,
  ],
  providers: [PubSubService, RootResolver],
  exports: [PubSubService],
})
export class GraphQLModule {}
