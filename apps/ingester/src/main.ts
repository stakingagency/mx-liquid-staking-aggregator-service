import { Logger, NestInterceptor } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OriginInterceptor } from '@multiversx/sdk-nestjs-http';
import { ApiConfigModule, ApiConfigService } from '@libs/common';

import '@multiversx/sdk-nestjs-common/lib/utils/extensions/array.extensions';
import '@multiversx/sdk-nestjs-common/lib/utils/extensions/date.extensions';
import '@multiversx/sdk-nestjs-common/lib/utils/extensions/number.extensions';
import '@multiversx/sdk-nestjs-common/lib/utils/extensions/string.extensions';

async function bootstrap() {
  const apiConfigApp = await NestFactory.create(ApiConfigModule);
  const apiConfig = apiConfigApp.get<ApiConfigService>(ApiConfigService);

  const app = await NestFactory.create(AppModule);
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); // TODO solve

  const globalInterceptors: NestInterceptor[] = [];
  globalInterceptors.push(new OriginInterceptor());
  app.useGlobalInterceptors(...globalInterceptors);

  await app.listen(apiConfig.getApiPort());

  const logger = new Logger('INGESTERS initializer');
  logger.log(`INGESTERS listening on port ${apiConfig.getApiPort()}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
