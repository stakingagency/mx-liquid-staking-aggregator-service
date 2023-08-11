
import { Module } from '@nestjs/common';
import { LoggingModule } from '@multiversx/sdk-nestjs-common';
import { ApiConfigModule, ApiConfigService, ApiMetricsModule, DynamicModuleUtils, HealthCheckModule, TABLE_PREFIX } from '@libs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GenericIndexerModule } from './generic-indexer/generic-indexer.module';
import { IngesterFactoryModule } from './utils/ingester-factory/ingester-factory.module';

@Module({
    imports: [
        LoggingModule,
        ApiConfigModule,
        DynamicModuleUtils.getApiModule(),
        HealthCheckModule,
        ApiMetricsModule,
        GenericIndexerModule,
        IngesterFactoryModule,
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
})
export class AppModule { }
