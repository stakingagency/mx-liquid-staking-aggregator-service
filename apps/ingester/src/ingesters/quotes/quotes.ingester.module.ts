import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MetricsModule } from '@multiversx/sdk-nestjs-monitoring';
import { CoinmarketcapQuotesIngester } from './coinmarketcap.quotes.ingester';
import { AlertsModule } from '@libs/common';
import { TimescaleModule } from '@libs/timescaledb';
import { QuotesModule } from '@libs/core';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MetricsModule,
    AlertsModule,
    QuotesModule,
    TimescaleModule,
  ],
  providers: [
    CoinmarketcapQuotesIngester,
  ],
})
export class QuotesIngesterModule { }
