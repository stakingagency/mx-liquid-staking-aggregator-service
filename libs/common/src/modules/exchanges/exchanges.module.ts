import { Module } from "@nestjs/common";
import { ApiConfigModule } from "../api-config/api.config.module";
import { ExchangesService } from "./exchanges.service";
import { ElasticUtils } from "../../utils/elastic.utils";
import { ApiConfigService } from "@libs/common";
import { ApiService } from "@multiversx/sdk-nestjs-http";
import { MetricsService } from "@multiversx/sdk-nestjs-monitoring";
import { ElasticModuleOptions, ElasticService } from "@multiversx/sdk-nestjs-elastic";

@Module({
  imports: [
    ApiConfigModule,
  ],
  providers: [
    {
      provide: ElasticUtils,
      useFactory: (apiConfigService: ApiConfigService, apiService: ApiService, metricsService: MetricsService) => new ElasticUtils(
        new ElasticService(
          new ElasticModuleOptions({
            url: apiConfigService.getInternalElasticUrl(),
            customValuePrefix: 'internal',
          }),
          apiService,
          metricsService
        )),
      inject: [ApiConfigService, ApiService, MetricsService],
    },
    ExchangesService,
  ],
  exports: [
    ExchangesService,
  ],
})
export class ExchangesModule { }
