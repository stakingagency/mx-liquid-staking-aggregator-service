import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import moment from 'moment';
import { IngestRecords, IngesterInterval } from '../../entities';
import { BaseIngester, DataApiIngester } from '../../utils';

@Injectable()
@DataApiIngester({
  name: 'experimental',
  cron: CronExpression.EVERY_10_SECONDS,
  interval: IngesterInterval.CURRENT_DAY,
})
export class ExperimentalIngester extends BaseIngester {
  // eslint-disable-next-line require-await
  public async fetchRecords(
    _startDate: moment.Moment,
    _endDate: moment.Moment,
  ): Promise<IngestRecords[]> {
    this.logger.log('Fetch data');
    return [];
  }

  // eslint-disable-next-line require-await
  public async checkRecords(_records: IngestRecords[]): Promise<string[]> {
    // TODO: implement
    return [];
  }
}
