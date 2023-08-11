import { Injectable } from "@nestjs/common";
import { BaseIngester, DataApiIngester } from "../../utils";
import { AlertsService, CronExpression, ElasticUtils, GatewayService } from "@libs/common";
import { IngestRecords, IngesterInterval } from "../../entities";
import { AccountsEntity, TimescaleQueryService, TimescaleWriteService } from "@libs/timescaledb";
import moment from "moment";


@Injectable()
@DataApiIngester({
  name: 'accounts-total-balance-with-stake',
  cron: CronExpression.EVERY_DAY_AT_12_10AM,
  interval: IngesterInterval.DAY_BEFORE,
})
export class AccountsTotalBalanceWithStakeIngester extends BaseIngester {
  constructor(
    timescaleWriteService: TimescaleWriteService,
    alertsService: AlertsService,
    private readonly elasticUtils: ElasticUtils,
    private readonly gatewayService: GatewayService,
    private readonly timescaleService: TimescaleQueryService,
  ) {
    super(timescaleWriteService, alertsService);
  }

  public async fetchRecords(_startDate: moment.Moment, _endDate: moment.Moment): Promise<IngestRecords[]> {
    const epoch = await this.gatewayService.getEpoch();
    const timestamp = moment.utc().startOf('day').subtract(1, 'days').toDate();

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
      'totalBalanceWithStakeNum',
      [0, 0.1, 1, 10, 100, 1000, 10000]
    );

    const previousResult24h = await this.timescaleService.getPreviousValue24h(AccountsEntity, timestamp, 'count_gt_0', 'totalbalancewithstake');
    const count24h = previousResult24h && previousResult24h > 0 ? count_gt_0 - previousResult24h : 0;

    const data = {
      totalbalancewithstake: {
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
    return [{
      entity: AccountsEntity,
      records: AccountsEntity.fromObject(timestamp, data),
    }];
  }

  // eslint-disable-next-line require-await
  public async checkRecords(_records: IngestRecords[]): Promise<string[]> {
    return [];
  }
}
