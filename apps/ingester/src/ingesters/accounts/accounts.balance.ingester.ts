import { Injectable } from '@nestjs/common';
import { BaseIngester, DataApiIngester } from '../../utils';
import { CronExpression } from '@nestjs/schedule';
import { IngestRecords, IngesterInterval } from '../../entities';
import { AccountsEntity, TimescaleQueryService, TimescaleWriteService } from '@libs/timescaledb';
import { AlertsService } from 'libs/common/src/modules/alerts';
import { GatewayService } from 'libs/common/src/modules/gateway/gateway.service';
import { ElasticUtils } from 'libs/common/src/utils/elastic.utils';
import BigNumber from 'bignumber.js';

@Injectable()
@DataApiIngester({
  name: 'accounts-balance',
  cron: CronExpression.EVERY_DAY_AT_7AM,
  interval: IngesterInterval.DAY_BEFORE,
})
export class AccountsBalanceIngester extends BaseIngester {
  constructor(
    timescaleWriteService: TimescaleWriteService,
    //TODO ADD metricsService: MetricsService,
    alertsService: AlertsService,
    private readonly gatewayService: GatewayService,
    private readonly elasticUtils: ElasticUtils,
    private readonly timescaleService: TimescaleQueryService,
  ) {
    super(timescaleWriteService, alertsService);
  }

  public async fetchRecords(
    startDate: moment.Moment,
    _endDate: moment.Moment,
  ): Promise<IngestRecords[]> {
    const epoch = await this.gatewayService.getEpoch();
    const timestamp = startDate.toDate();

    const [
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
    ] = await this.elasticUtils.getDetailedRangeCount(
      `accounts-000001_${epoch}`,
      'balanceNum',
      [0, 0.1, 1, 10, 100, 1000, 10000],
    );

    const previousResult24h = await this.timescaleService.getPreviousValue24h(
      AccountsEntity,
      timestamp,
      'count_gt_0',
      'balance',
    );
    const count24h =
      previousResult24h && previousResult24h > 0
        ? count_gt_0 - previousResult24h
        : 0;

    const data = {
      balance: {
        count_gt_0,
        count_gt_0_1,
        count_gt_1,
        count_gt_10,
        count_gt_100,
        count_gt_1000,
        count_gt_10000,
        count_24h: count24h,
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
  async checkRecords(records: IngestRecords[]): Promise<string[]> {
    const entities = records.map((r) => r.records).flat();

    const warnings = [];

    if (entities.length === 0) {
      warnings.push('No records have been ingested');
    }

    if (entities.length !== 8) {
      warnings.push('Could not collect all records');
    }

    for (const entity of entities) {
      if (new BigNumber(entity.value).isZero()) {
        warnings.push(`Value is 0 for ${entity.series}.${entity.key}`);
      }
    }

    return warnings;
  }
}
