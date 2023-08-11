import { Module } from '@nestjs/common';
import { GenericIndexerController } from './generic-indexer.controller';
import { IngesterFactoryModule } from '../utils/ingester-factory/ingester-factory.module';
import { TimescaleModule } from '@libs/timescaledb';

@Module({
  imports: [
    TimescaleModule,
    IngesterFactoryModule,
  ],
  controllers: [GenericIndexerController],
})
export class GenericIndexerModule { }
