// TODO refactor
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { Plugin } from '@nestjs/apollo';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';
import { UserInputError } from 'apollo-server-express';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  public static readonly MAX_COMPLEXITY = 1000; // TODO get from config

  constructor(private gqlSchemaHost: GraphQLSchemaHost) {}

  // eslint-disable-next-line require-await
  async requestDidStart(): Promise<GraphQLRequestListener> {
    const { schema } = this.gqlSchemaHost;

    return {
      // eslint-disable-next-line require-await
      async didResolveOperation({ request, document }) {
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 0 }),
          ],
        });

        if (complexity > ComplexityPlugin.MAX_COMPLEXITY) {
          throw new UserInputError(
            `Query is too complex: ${complexity}. Maximum allowed complexity: ${ComplexityPlugin.MAX_COMPLEXITY}`,
          );
        }
      },
    };
  }
}
