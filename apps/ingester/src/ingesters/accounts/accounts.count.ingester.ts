import { Injectable } from '@nestjs/common';
import { BaseIngester, DataApiIngester } from '../../utils';
import { CronExpression } from 'libs/common/src/utils/schedule.enum';
import { IngestRecords, IngesterInterval } from '../../entities';
import { AccountsEntity, TimescaleQueryService, TimescaleWriteService } from '@libs/timescaledb';
import { AlertsService, ApiConfigService } from '@libs/common';
import { GatewayService } from 'libs/common/src/modules/gateway/gateway.service';
import { ElasticService } from '@multiversx/sdk-nestjs-elastic';
import { Moment } from 'moment';

@Injectable()
@DataApiIngester({
  name: 'accounts-count',
  cron: CronExpression.EVERY_DAY_AT_12_10AM,
  interval: IngesterInterval.DAY_BEFORE,
})
export class AccountsCountIngester extends BaseIngester {
  constructor(
    timescaleWriteService: TimescaleWriteService,
    alertsService: AlertsService,
    private readonly apiConfigService: ApiConfigService,
    private readonly gatewayService: GatewayService,
    private readonly elasticService: ElasticService,
    private readonly timescaleService: TimescaleQueryService,
  ) {
    super(timescaleWriteService, alertsService);
  }

  public async fetchRecords(
    startDate: Moment,
    _endDate: Moment,
  ): Promise<IngestRecords[]> {
    const epoch = await this.gatewayService.getEpoch();
    const timestamp = startDate.toDate();

    //TODO - Get users count from xportal
    const [
      accountsCount,
      {
        data: { count: contractsCount },
      },
    ] = await Promise.all([
      this.elasticService.getCount(`accounts-000001_${epoch}`),
      this.elasticService.get(
        `${this.apiConfigService.getElasticUrl()}/scdeploys/_count`,
      ),
    ]);

    const [previousAccountsResult24h, previousContractsResult24h] =
      await Promise.all([
        this.timescaleService.getPreviousValue24h(
          AccountsEntity,
          timestamp,
          'accounts',
          'count',
        ),
        this.timescaleService.getPreviousValue24h(
          AccountsEntity,
          timestamp,
          'contracts',
          'count',
        ),
      ]);

    const accountsCount24h =
      previousAccountsResult24h && previousAccountsResult24h > 0
        ? accountsCount - previousAccountsResult24h
        : 0;
    const contractsCount24h =
      previousContractsResult24h && previousContractsResult24h > 0
        ? contractsCount - previousContractsResult24h
        : 0;

    const data = {
      accounts: {
        count: accountsCount,
        count_24h: accountsCount24h,
      },
      contracts: {
        count: contractsCount,
        count_24h: contractsCount24h,
      },
    };
    return [
      {
        entity: AccountsEntity,
        records: AccountsEntity.fromObject(timestamp, data),
      },
    ];
  }

  // eslint-disable-next-line require-await
  async checkRecords(_records: IngestRecords[]): Promise<string[]> {
    return [];
  }
}
