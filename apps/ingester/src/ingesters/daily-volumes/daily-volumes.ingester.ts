import { BaseIngester, DataApiIngester } from "../../utils";
import { IngestRecords, IngesterInterval } from "../../entities";
import { TimescaleWriteService } from "@libs/timescaledb";
import { AlertsService, CronExpression } from "@libs/common";
import { Injectable } from "@nestjs/common";
import { Moment } from "moment";
import { DailyVolumesEntiy } from "libs/timescaledb/src/entities/daily-volumes.entity";
import { DailyVolumesService } from "@libs/core";

@Injectable()
@DataApiIngester({
    name: 'daily-volumes',
    cron: CronExpression.EVERY_DAY_AT_10AM,
    interval: IngesterInterval.DAY_BEFORE,
})
export class DailyVolumesIngester extends BaseIngester {
    constructor(
        timescaleWriteService: TimescaleWriteService,
        alertsService: AlertsService,
        private readonly dailyVolumesService: DailyVolumesService,
    ) {
        super(timescaleWriteService, alertsService);
    }

    public async fetchRecords(
        startDate: Moment,
        endDate: Moment,
    ): Promise<IngestRecords[]> {
        const sumDailyValues = await this.dailyVolumesService.getValuesSum(startDate, endDate);

        const data = {
            value: {
                dailyValue: sumDailyValues.toFixed(),
            },
        };

        return [{
            entity: DailyVolumesEntiy,
            records: DailyVolumesEntiy.fromObject(startDate.toDate(), data),
        }];
    }

    // eslint-disable-next-line require-await
    async checkRecords(_records: IngestRecords[]): Promise<string[]> {
        return [];
    }
}
