import { GenericIngestEntity_EXPERIMENTAL } from 'apps/ingester/src/entities/generic-ingest-experimental.entity';
import { GenericIngestEntity } from 'apps/ingester/src/entities/generic-ingest.entity';
import moment from 'moment';
import { Repository, SelectQueryBuilder } from 'typeorm';

export function getPreviousValue24hQuery<
  T extends GenericIngestEntity | GenericIngestEntity_EXPERIMENTAL,
>(
  repository: Repository<T>,
  currentTimestamp: Date,
  series: string,
  key: string,
): SelectQueryBuilder<T> {
  const ago24h = moment.utc(currentTimestamp).add(-1, 'days').toISOString();

  let query = repository
    .createQueryBuilder()
    .where('key = :key')
    .andWhere('timestamp <= :ago24h')
    .setParameters({
      key,
      series,
      ago24h,
    })
    .orderBy('timestamp', 'DESC')
    .limit(1);

  if (series) {
    query = query.andWhere('series = :series');
  }

  return query;
}
