import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';

import { GraphqlConfig } from '@/shared/config/config.interface';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}
  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig: any = this.configService.get<GraphqlConfig>('graphql');
    return {
      // schema options
      autoSchemaFile: graphqlConfig.schemaDestination || './src/schema.graphql',
      sortSchema: graphqlConfig.sortSchema,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      // subscription
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true,
        // 'subscriptions-transport-ws': true,
      },
      playground: graphqlConfig.playgroundEnabled,
      fieldResolverEnhancers: ['guards'],
      context: ({ req, connection }) =>
        connection ? { req: { headers: connection.context } } : { req },
      // context: (context) => {
      //   if (context?.extra?.request) {
      //     return {
      //       req: {
      //         ...context?.extra?.request,
      //         headers: {
      //           ...context?.extra?.request?.headers,
      //           ...context?.connectionParams,
      //         },
      //       },
      //     };
      //   }

      //   return { req: context?.req };
      // },
    };
  }
}
