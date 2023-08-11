import { Entity, Index, Unique } from "typeorm";
import { IngestEntity } from "./ingest.entity";

@Entity('exchanges')
@Unique(['timestamp', 'series', 'key'])
@Index(['series', 'key'])
export class ExchangesEntity extends IngestEntity { }
