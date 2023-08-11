import { Injectable } from "@nestjs/common";
import { CronExpression } from "libs/common/src/utils/schedule.enum";
import { IngestRecords, IngesterInterval } from "../../entities";
import { BaseIngester, DataApiIngester } from "../../utils";
import { ExchangesEntity, TimescaleWriteService } from "@libs/timescaledb";
import { AlertsService } from "libs/common/src/modules";
import { ExchangesService } from "libs/common/src/modules/exchanges";
import BigNumber from "bignumber.js";

@Injectable()
@DataApiIngester({
  name: 'exchanges',
  cron: CronExpression.EVERY_DAY_AT_12_10AM,
  interval: IngesterInterval.DAY_BEFORE,
})
export class ExchangesIngester extends BaseIngester {

  constructor(
    timescaleWriteService: TimescaleWriteService,
    alertsService: AlertsService,
    private readonly exchangesService: ExchangesService,
  ) {
    super(timescaleWriteService, alertsService);
  }

  public async fetchRecords(startDate: moment.Moment, endDate: moment.Moment): Promise<IngestRecords[]> {
    const data: any = {};

    let totalInflows = new BigNumber(0);
    let totalOutflows = new BigNumber(0);

    const exchanges = this.exchangesService.getExchanges();
    for (const exchange of exchanges) {
      const inflows = await this.exchangesService.getExchangeInflows(exchange.addresses, startDate, endDate);
      const outflows = await this.exchangesService.getExchangeOutflows(exchange.addresses, startDate, endDate);
      const total = inflows.plus(outflows);

      totalInflows = totalInflows.plus(inflows);
      totalOutflows = totalOutflows.plus(outflows);

      data[exchange.identifier] = {
        total: total.shiftedBy(-18).toFixed(),
        inflows: inflows.shiftedBy(-18).toFixed(),
        outflows: outflows.shiftedBy(-18).toFixed(),
      };
    }

    data['total'] = {
      total: totalInflows.plus(totalOutflows).shiftedBy(-18).toFixed(),
      inflows: totalInflows.shiftedBy(-18).toFixed(),
      outflows: totalOutflows.shiftedBy(-18).toFixed(),
    };

    return [{
      entity: ExchangesEntity,
      records: ExchangesEntity.fromObject(startDate.toDate(), data),
    }];
  }

  // eslint-disable-next-line require-await
  async checkRecords(_records: IngestRecords[]): Promise<string[]> {
    // TODO: implement
    return [];
  }
}
