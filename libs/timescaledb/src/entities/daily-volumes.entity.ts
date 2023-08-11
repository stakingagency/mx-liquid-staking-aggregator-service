import { Entity, Index, Unique } from 'typeorm';
import { IngestEntity } from './ingest.entity';

@Entity('daily_volumes')
@Unique(['timestamp', 'series', 'key'])
@Index(['series', 'key'])
export class DailyVolumesEntiy extends IngestEntity { }
