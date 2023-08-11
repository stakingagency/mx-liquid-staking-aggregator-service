import { Entity, Index, Unique } from 'typeorm';
import { IngestEntity } from './ingest.entity';

@Entity('accounts')
@Unique(['timestamp', 'series', 'key'])
@Index(['series', 'key'])
export class AccountsEntity extends IngestEntity { }
