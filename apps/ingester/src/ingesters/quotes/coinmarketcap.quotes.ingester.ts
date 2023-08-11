import { Injectable } from "@nestjs/common";
import { IngestRecords, IngesterInterval } from "../../entities";
import { BaseIngester, DataApiIngester } from "../../utils";
import { TimescaleWriteService } from "@libs/timescaledb";
import { AlertsService, CronExpression } from "@libs/common";
import { QuotesService } from "@libs/core";

@Injectable()
@DataApiIngester({
  name: 'coinmarketcap-quotes',
  cron: CronExpression.EVERY_HOUR,
  // cron: CronExpression.EVERY_10_SECONDS,
  interval: IngesterInterval.CURRENT_DAY,
})
export class CoinmarketcapQuotesIngester extends BaseIngester {
  constructor(
    timescaleWriteService: TimescaleWriteService,
    alertsService: AlertsService,
    private readonly quotesService: QuotesService,
  ) {
    super(timescaleWriteService, alertsService);
  }

  public async fetchRecords(_startDate: moment.Moment, _endDate: moment.Moment): Promise<IngestRecords[]> {
    const supportedCoins = await this.quotesService.getSupportedCoins();

    console.log('supportedCoins', supportedCoins);

    return [];
  }

  // eslint-disable-next-line require-await
  async checkRecords(_records: IngestRecords[]): Promise<string[]> {
    // TODO: implement
    return [];
  }
}
