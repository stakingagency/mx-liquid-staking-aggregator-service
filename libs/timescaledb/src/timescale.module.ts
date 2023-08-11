import { Module } from '@nestjs/common';
import { TimescaleQueryService, TimescaleWriteService } from './services';
import { QuotesRepository } from './repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteCoinEntity } from './entities';

@Module({
  imports: [
    // forwardRef(() => MetricsModule),
    // forwardRef(() => CacheModule),
    TypeOrmModule.forFeature([
      QuoteCoinEntity,
    ]),
  ],
  providers: [
    TimescaleQueryService,
    TimescaleWriteService,
    QuotesRepository,
  ],
  exports: [
    TimescaleQueryService,
    TimescaleWriteService,
    QuotesRepository,
  ],
})
export class TimescaleModule { }
