import { OriginLogger } from '@multiversx/sdk-nestjs-common';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';
import { LogPerformanceAsync, MetricsEvents } from '@libs/common';
import { IngestEntity } from '../entities';

@Injectable()
export class TimescaleWriteService {
  private readonly logger = new OriginLogger(TimescaleWriteService.name);

  constructor(private readonly timescaleDataSource: DataSource) { }

  @LogPerformanceAsync(MetricsEvents.SetTimescaleWriteDuration, { argIndex: 1 })
  public async writeData<T extends IngestEntity>(entityTarget: EntityTarget<T>, entity: T | T[]): Promise<void> {
    try {
      const repository = this.timescaleDataSource.getRepository(entityTarget);

      this.logger.log(`Write ${Array.isArray(entity) ? entity.length : 1} records on ${IngestEntity.getName(entityTarget)}`);

      const query = repository
        .createQueryBuilder()
        .insert()
        .into(entityTarget)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .values(entity)
        .orUpdate(['value'], ['timestamp', 'series', 'key']);

      await query.execute();
    } catch (error) {
      this.logger.error(`An unhandled error occurred when writing data on '${entityTarget.toString()}'`);
      this.logger.error(error);

      throw error;
    }
  }
}
