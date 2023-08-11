import { IngestEntity } from '@libs/timescaledb';
import { EntityTarget } from 'typeorm';

export class IngestRecords {
  entity!: EntityTarget<IngestEntity>;
  records!: IngestEntity[];
  upsert?: boolean = false;
}
