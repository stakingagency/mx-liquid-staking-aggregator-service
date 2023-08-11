import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ExchangesIngester } from './exchanges.ingester';
import { MetricsModule } from '@multiversx/sdk-nestjs-monitoring';
import { AlertsModule } from 'libs/common/src/modules';
import { ExchangesModule } from 'libs/common/src/modules/exchanges';
import { TimescaleModule } from '@libs/timescaledb';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MetricsModule,
    AlertsModule,
    ExchangesModule,
    TimescaleModule,
  ],
  providers: [
    ExchangesIngester,
  ],
})
export class ExchangesIngesterModule { }
