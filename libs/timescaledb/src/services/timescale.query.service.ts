import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';
import { OriginLogger } from '@multiversx/sdk-nestjs-common';
import { IngestEntity } from '../entities';
import moment from 'moment';

@Injectable()
export class TimescaleQueryService {
  private readonly logger = new OriginLogger(TimescaleQueryService.name);

  constructor(
    private readonly timescaleDataSource: DataSource
  ) { }

  public async getPreviousValue24h<T extends IngestEntity>(
    entityTarget: EntityTarget<T>,
    currentTimestamp: Date,
    series: string,
    key: string,
  ): Promise<number | undefined> {
    try {
      const repository = this.timescaleDataSource.getRepository(entityTarget);

      const ago24h = moment.utc(currentTimestamp).add(-1, 'days').toISOString();

      const query = repository
        .createQueryBuilder()
        .where('key = :key')
        .andWhere('series = :series')
        .andWhere('timestamp <= :ago24h')
        .setParameters({
          key,
          series,
          ago24h,
        })
        .orderBy('timestamp', 'DESC')
        .limit(1);

      const entity = await query.getOne();
      return Number(entity?.value);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
