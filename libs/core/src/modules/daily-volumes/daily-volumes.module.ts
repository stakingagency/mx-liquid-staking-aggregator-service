import { Module } from '@nestjs/common';
import { DailyVolumesService } from './daily-volumes.service';
import { ElasticModuleOptions, ElasticService } from '@multiversx/sdk-nestjs-elastic';
import { ApiConfigService } from '@libs/common';
import { ApiModuleOptions, ApiService } from '@multiversx/sdk-nestjs-http';
import { MetricsService } from '@multiversx/sdk-nestjs-monitoring';

@Module({
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
    ApiService,
    ApiModuleOptions,
    DailyVolumesService,
  ],
  exports: [DailyVolumesService],
})
export class DailyVolumesModule { }

