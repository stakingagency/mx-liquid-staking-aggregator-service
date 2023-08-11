import {
  ApiConfigModule,
  ApiConfigService,
  ApiMetricsModule,
  DynamicModuleUtils,
  HealthCheckModule,
  TABLE_PREFIX,
} from '@libs/common';
import { LoggingModule } from '@multiversx/sdk-nestjs-common';
import { Module } from '@nestjs/common';
import { IngestersModule } from './ingesters';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
@Module({
  imports: [
    LoggingModule,
    ApiConfigModule,
    ApiMetricsModule,
    HealthCheckModule,
    IngestersModule,
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (apiConfigService: ApiConfigService) => ({
        type: 'postgres',
        ...apiConfigService.getTimescaleConnection(),
        keepConnectionAlive: true,
        synchronize: false,
        logging: ['warn', 'error'],
        entityPrefix: TABLE_PREFIX,
        migrationsTableName: `${TABLE_PREFIX}migrations`,
        entities: [
          'dist/**/*.entity{.ts,.js}',
        ],
        maxQueryExecutionTime: 2000,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options!);
        await dataSource.initialize();
        return dataSource;
      },
    }),
  ],
  providers: [DynamicModuleUtils.getPubSubService()],
})
export class AppModule { }
