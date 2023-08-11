import { Module } from '@nestjs/common';
import { AccountsBalanceIngester } from './accounts.balance.ingester';
import { AlertsModule } from 'libs/common/src/modules/alerts';
import { GatewayModule } from 'libs/common/src/modules/gateway/gateway.module';
import { AccountsCountIngester } from './accounts.count.ingester';
import { AccountsDelegationIngester } from './accounts.delegation.ingester';
import { TimescaleModule } from '@libs/timescaledb';
import { ApiConfigService, DynamicModuleUtils, ElasticUtils } from '@libs/common';
import { ElasticModule, ElasticModuleOptions, ElasticService } from '@multiversx/sdk-nestjs-elastic';
import { ApiService } from '@multiversx/sdk-nestjs-http';
import { MetricsService } from '@multiversx/sdk-nestjs-monitoring';
import { AccountsDelegationLegacyActiveIngester } from './accounts-delegation-legacy-active.ingester';
import { AccountsTotalBalanceWithStakeIngester } from './accounts-total-balance-with-stake.ingester';
import { AccountsTotalStakeIngester } from './accounts-total-stake.ingester';
@Module({
  imports: [
    AlertsModule,
    GatewayModule,
    TimescaleModule,
    DynamicModuleUtils.getApiModule(),
    ElasticModule,
  ],
  providers: [
    {
      provide: ElasticService,
      useFactory: (apiConfigService: ApiConfigService, apiService: ApiService, metricsService: MetricsService) =>
        new ElasticService(
          new ElasticModuleOptions({
            url: apiConfigService.getInternalElasticUrl(),
            customValuePrefix: 'internal',
          }),
          apiService,
          metricsService
        ),
      inject: [ApiConfigService, ApiService, MetricsService],
    },
    {
      provide: ElasticUtils,
      useFactory: (elasticService: ElasticService) => new ElasticUtils(elasticService),
      inject: [ElasticService],
    },
    AccountsBalanceIngester,
    AccountsCountIngester,
    AccountsDelegationIngester,
    AccountsDelegationLegacyActiveIngester,
    AccountsTotalBalanceWithStakeIngester,
    AccountsTotalStakeIngester,
  ],
})
export class AccountsModule { }
