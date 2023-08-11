import { IngestRecords, IngesterInterval } from '../entities';
import {
  BatchUtils,
  LockResult,
  Locker,
  OriginLogger,
} from '@multiversx/sdk-nestjs-common';
import { DataApiIngesterOptions } from './ingester.decorator';
import moment from 'moment';
import { TimescaleWriteService } from 'libs/timescaledb/src';
import { AlertsService } from 'libs/common/src/modules';

export abstract class BaseIngester {
  public static readonly MAX_RETRIES = 3;
  public static readonly CHUNK_SIZE = 100;

  protected readonly logger = new OriginLogger('Ingester');

  constructor(
    private readonly timescaleWriteService: TimescaleWriteService,
    // private readonly metricsService: ApiMetricsService, // TODO add ingester metrics
    private readonly alertsService: AlertsService,
  ) { }

  abstract fetchRecords(
    startDate: moment.Moment,
    endDate: moment.Moment,
  ): Promise<IngestRecords[]>;

  abstract checkRecords(records: IngestRecords[]): Promise<string[]>;

  public async run(options: DataApiIngesterOptions): Promise<void> {
    this.logger.log(`Start ingesting data for ${options.name} ingester`);

    let retries = 0;
    let result = LockResult.ERROR;
    while (result === LockResult.ERROR && retries < BaseIngester.MAX_RETRIES) {
      if (result === LockResult.ERROR && retries > 0) {
        this.logger.log(`Retry #${retries} for fetcher '${options.name}'`);
      }

      result = await Locker.lock(
        options.name,
        async () => {
          const [startDate, endDate] = this.computeIngesterInterval(
            options.interval,
          );

          const records = await this.fetchRecords(startDate, endDate);

          this.logger.log(
            `Fetched ${records.length} record sets from '${options.name}'`,
          );

          await this.writeRecords(records);

          const warnings = await this.checkRecords(records);
          if (warnings.length > 0) {
            this.logger.warn(
              `Found ${warnings.length} warnings for '${options.name
              }': ${warnings.join('; ')}`,
            );

            await this.alertsService.sendIngesterWarning(
              options.name,
              warnings,
            );
          }
        },
        true,
      );

      retries++;
    }

    if (result === LockResult.ERROR) {
      this.logger.error(
        `Could not fetch data for '${options.name}' after ${BaseIngester.MAX_RETRIES} retries`,
      );

      await this.alertsService.sendIngesterError(options.name);
    }
  }

  private async writeRecords(records: IngestRecords[]): Promise<void> {
    for (const record of records) {
      const chunks = BatchUtils.splitArrayIntoChunks(
        record.records,
        BaseIngester.CHUNK_SIZE,
      );
      for (const chunk of chunks) {
        await this.timescaleWriteService.writeData(record.entity, chunk);
      }
    }
  }

  private computeIngesterInterval(
    interval: IngesterInterval,
  ): [moment.Moment, moment.Moment] {
    switch (interval) {
      case IngesterInterval.DAY_BEFORE:
        const startOfPreviousDay = moment
          .utc()
          .startOf('day')
          .subtract(1, 'day');
        const endOfPreviousDay = moment.utc().startOf('day');
        return [startOfPreviousDay, endOfPreviousDay];
      case IngesterInterval.CURRENT_DAY: {
        const startOfCurrentDay = moment.utc().startOf('day');
        const endOfCurrentDay = moment.utc().endOf('day');
        return [startOfCurrentDay, endOfCurrentDay];
      }
    }
  }
}
