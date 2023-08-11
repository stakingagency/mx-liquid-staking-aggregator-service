import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ExperimentalIngesterModule } from './experimental';
import { AccountsModule } from './accounts/accounts.ingester.module';
import { TimescaleModule } from '@libs/timescaledb';
import { ExchangesIngesterModule } from './exchanges';
import { DailyVolumesModule } from './daily-volumes/daily-volumes.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TimescaleModule,
    ExperimentalIngesterModule,
    AccountsModule,
    ExchangesIngesterModule,
    // QuotesIngesterModule,
    DailyVolumesModule,
  ],
  providers: [],
})
export class IngestersModule { }
