import { Injectable } from '@nestjs/common';
import { BaseIngester, DataApiIngester } from '../../utils';
import { IngestRecords, IngesterInterval } from '../../entities';
import { AccountsEntity, TimescaleWriteService } from '@libs/timescaledb';
import { AlertsService } from 'libs/common/src/modules';
import { GatewayService } from 'libs/common/src/modules/gateway/gateway.service';
import { TimescaleQueryService } from 'libs/timescaledb/src/services/timescale.query.service';
import { ElasticUtils } from 'libs/common/src/utils/elastic.utils';
import { CronExpression } from 'libs/common/src/utils/schedule.enum';

@Injectable()
@DataApiIngester({
    name: 'accounts-delegation',
    cron: CronExpression.EVERY_DAY_AT_12_10AM,
    interval: IngesterInterval.DAY_BEFORE,
})
export class AccountsDelegationIngester extends BaseIngester {
    constructor(
        timescaleWriteService: TimescaleWriteService,
        alertsService: AlertsService,
        private readonly gatewayService: GatewayService,
        private readonly timescaleService: TimescaleQueryService,
        private readonly elasticUtils: ElasticUtils,
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
            'delegationNum',
            [0, 0.1, 1, 10, 100, 1000, 10000],
        );

        const previousResult24h = await this.timescaleService.getPreviousValue24h(
            AccountsEntity,
            timestamp,
            'count_gt_0',
            'delegation',
        );
        const count24h =
            previousResult24h && previousResult24h > 0
                ? count_gt_0 - previousResult24h
                : 0;

        const data = {
            delegation: {
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
    async checkRecords(_records: IngestRecords[]): Promise<string[]> {
        return [];
    }
}
