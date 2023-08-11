import { Injectable, Logger } from '@nestjs/common';
import { GenericIngestEntity } from 'apps/ingester/src/entities/generic-ingest.entity';
import { DataSource, EntityTarget } from 'typeorm';
import * as timescaleQueries from './timescale.queries';
import { GenericIngestEntity_EXPERIMENTAL } from 'apps/ingester/src/entities/generic-ingest-experimental.entity';

@Injectable()
export class TimescaleService {
  private readonly logger: Logger;

  constructor(private readonly timescaleDataSource: DataSource) {
    this.logger = new Logger(TimescaleService.name);
  }

  public async getPreviousValue24h<
    T extends GenericIngestEntity | GenericIngestEntity_EXPERIMENTAL,
  >(
    entityTarget: EntityTarget<T>,
    currentTimestamp: Date,
    series: string,
    key: string,
  ): Promise<number | undefined> {
    try {
      const repository = this.timescaleDataSource.getRepository(entityTarget);
      const query = timescaleQueries.getPreviousValue24hQuery(
        repository,
        currentTimestamp,
        series,
        key,
      );

      const entity = await query.getOne();
      return Number(entity?.value);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
