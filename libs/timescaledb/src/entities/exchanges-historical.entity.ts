import { GenericIngestEntity } from "apps/ingester/src/entities/generic-ingest.entity";
import { Entity } from "typeorm";

@Entity('exchanges_historical')
export class ExchangesHistoricalEntity extends GenericIngestEntity { }
