import { Module } from '@nestjs/common';
import { IngesterFactoryService } from './ingester-factory.service';
import { DailyVolumesIngester } from 'apps/ingester/src/ingesters/daily-volumes';
import { AlertsModule, ApiConfigService } from '@libs/common';
import { DailyVolumesService } from '@libs/core';
import { ElasticModuleOptions, ElasticService } from '@multiversx/sdk-nestjs-elastic';
import { ApiService } from '@multiversx/sdk-nestjs-http';
import { MetricsService } from '@multiversx/sdk-nestjs-monitoring';
import { TimescaleModule } from '@libs/timescaledb';

@Module({
  imports: [
    TimescaleModule,
    AlertsModule,
  ],
  providers: [
    {
      provide: ElasticService,
      useFactory: (apiConfigService: ApiConfigService, apiService: ApiService, metricsService: MetricsService) =>
        new ElasticService(
          new ElasticModuleOptions({
            url: apiConfigService.getElasticUrl(),
            customValuePrefix: 'api',
          }),
          apiService,
          metricsService
        ),
      inject: [ApiConfigService, ApiService, MetricsService],
    },
    DailyVolumesService,
    DailyVolumesIngester,
    IngesterFactoryService,
  ],
  exports: [
    IngesterFactoryService,
  ],
})
export class IngesterFactoryModule { }
