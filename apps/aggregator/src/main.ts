import { Logger, NestInterceptor } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ApiConfigModule, ApiConfigService } from '@libs/common';
import { OriginInterceptor } from '@multiversx/sdk-nestjs-http';
import {
  LoggingInterceptor,
  MetricsService,
} from '@multiversx/sdk-nestjs-monitoring';

import '@multiversx/sdk-nestjs-common/lib/utils/extensions/array.extensions';
import '@multiversx/sdk-nestjs-common/lib/utils/extensions/date.extensions';
import '@multiversx/sdk-nestjs-common/lib/utils/extensions/number.extensions';
import '@multiversx/sdk-nestjs-common/lib/utils/extensions/string.extensions';

async function bootstrap() {
  const apiConfigApp = await NestFactory.create(ApiConfigModule);
  const apiConfig = apiConfigApp.get<ApiConfigService>(ApiConfigService);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(requestIp.mw());
  app.enableCors();
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); // TODO solve
  app.disable('etag');
  app.disable('x-powered-by');
  app.setGlobalPrefix(apiConfig.getApiPrefix());

  const metricsService = app.get<MetricsService>(MetricsService);
  const httpAdapterHost = app.get<HttpAdapterHost>(HttpAdapterHost);

  const httpServer = httpAdapterHost.httpAdapter.getHttpServer();
  httpServer.keepAliveTimeout = apiConfig.getServerTimeout();
  httpServer.headersTimeout = apiConfig.getHeadersTimeout();

  const globalInterceptors: NestInterceptor[] = [];
  globalInterceptors.push(new OriginInterceptor());
  globalInterceptors.push(new LoggingInterceptor(metricsService));
  app.useGlobalInterceptors(...globalInterceptors);

  await app.listen(apiConfig.getApiPort());

  const logger = new Logger('Aggregator initializer');
  logger.log(`Aggregator listening on port ${apiConfig.getApiPort()}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
