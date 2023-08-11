import {
  ApiConfigModule,
  ApiMetricsModule,
  ComplexityPlugin,
  GraphQLUtils,
  HealthCheckModule,
} from '@libs/common';
import { LoggingModule } from '@multiversx/sdk-nestjs-common';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ResolversModule } from './resolvers';

@Module({
  imports: [
    LoggingModule,
    ApiConfigModule,
    ApiMetricsModule,
    HealthCheckModule,
    ResolversModule,
    GraphQLModule.forRoot({
      useGlobalPrefix: true,
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        fieldMiddleware: [GraphQLUtils.deprecationLoggerMiddleware],
      },
      formatResponse: GraphQLUtils.formatResponse,
      formatError: GraphQLUtils.formatError,
    }),
  ],
  providers: [ComplexityPlugin],
})
export class AppModule {}
