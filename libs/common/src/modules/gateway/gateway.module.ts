import { forwardRef, Module } from '@nestjs/common';
import { ApiConfigModule } from '../api-config/api.config.module';

import { MetricsModule } from '@multiversx/sdk-nestjs-monitoring';
import { CacheModule } from '@multiversx/sdk-nestjs-cache';
import { ApiModule } from '@multiversx/sdk-nestjs-http';
import { GatewayService } from './gateway.service';

@Module({
  imports: [
    ApiConfigModule,
    ApiModule,
    forwardRef(() => MetricsModule),
    forwardRef(() => CacheModule),
  ],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
