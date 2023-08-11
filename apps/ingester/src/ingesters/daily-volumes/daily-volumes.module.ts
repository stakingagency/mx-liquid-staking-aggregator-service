import { AlertsModule, DynamicModuleUtils } from '@libs/common';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DailyVolumesModule as DailyVolumesCoreModule } from '@libs/core';
import { DailyVolumesIngester } from './daily-volumes.ingester';
import { TimescaleModule } from '@libs/timescaledb';


@Module({
    imports: [
        ScheduleModule.forRoot(),
        AlertsModule,
        TimescaleModule,
        DynamicModuleUtils.getApiModule(),
        DailyVolumesCoreModule,
    ],
    providers: [
        DailyVolumesIngester,
    ],
    exports: [
        DailyVolumesIngester,
    ],
})
export class DailyVolumesModule { }
