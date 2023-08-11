import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ExperimentalIngester } from './experimental.ingester';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ExperimentalIngester],
})
export class ExperimentalIngesterModule {}
