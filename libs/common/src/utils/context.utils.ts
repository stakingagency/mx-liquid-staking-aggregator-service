import { ContextTracker } from '@multiversx/sdk-nestjs-common';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataApiConsumer } from '../entities/data.api.consumer';

export class ContextUtils {
  static storeConsumer(consumer: DataApiConsumer): void {
    ContextTracker.assign({ consumer });
  }

  static getConsumer(): DataApiConsumer | undefined {
    const context = ContextTracker.get();
    return context?.consumer;
  }

  static getRequestFromContext(context: ExecutionContext) {
    let request = context.switchToHttp().getRequest();
    if (!request) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    return request;
  }
}
