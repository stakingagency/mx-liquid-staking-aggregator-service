import { Logger } from '@nestjs/common';
import { MiddlewareContext, NextFn } from '@nestjs/graphql';
import {
  GraphQLRequestContext,
  GraphQLResponse,
} from 'apollo-server-plugin-base';
import { randomUUID } from 'crypto';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

export class GraphQLUtils {
  static async deprecationLoggerMiddleware(
    ctx: MiddlewareContext,
    next: NextFn,
  ) {
    const value = await next();
    const { context } = ctx;
    const request = context.req;
    const fieldConfig = ctx.info.parentType.getFields()[ctx.info.fieldName];
    if (fieldConfig.deprecationReason) {
      const { name, description, deprecationReason } = fieldConfig;
      const deprecateWarning = {
        name,
        description,
        deprecationReason,
      };
      request.deprecationWarning = [
        ...(request?.deprecationWarning || []),
        deprecateWarning,
      ];
    }
    return value;
  }

  static formatResponse(
    response: GraphQLResponse,
    requestContext: GraphQLRequestContext,
  ) {
    const { context } = requestContext;
    const { req } = context;
    const extensionResponse = req?.deprecationWarning
      ? {
          extensions: {
            deprecationWarning: req?.deprecationWarning,
          },
        }
      : {};
    return {
      ...response,
      ...extensionResponse,
    };
  }

  static formatError(error: GraphQLError): GraphQLFormattedError {
    const logger = new Logger('GraphQL');

    const errorId = randomUUID();
    let errorMessage = error.message;

    if (error.extensions.code === 'INTERNAL_SERVER_ERROR') {
      errorMessage = 'Internal Server Error';
    }

    logger.error(
      `An unhandled error occurred. ID: '${errorId}'. Error: ${JSON.stringify(
        error,
      )}`,
    );

    const graphQLFormattedError: GraphQLFormattedError = {
      message: errorMessage,
      path: error.path,
      extensions: {
        code: error.extensions.code,
        id: errorId,
      },
    };

    return graphQLFormattedError;
  }
}
