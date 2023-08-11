import { TimescaleWriteService } from '@libs/timescaledb';
import { Controller, Param, Post, Query } from '@nestjs/common';
import moment from 'moment';
import { IngesterFactoryService } from '../utils/ingester-factory/ingester-factory.service';
import { AvailableIngesters } from './entities/available.ingesters.enum';
import { OriginLogger } from '@multiversx/sdk-nestjs-common';

@Controller('generic-indexer/:ingester')
export class GenericIndexerController {
    private readonly logger = new OriginLogger('GenericIndexer');
    constructor(
        private timescaleWriteService: TimescaleWriteService,
        private readonly genericIngester: IngesterFactoryService
    ) { }

    @Post()
    async startIndexing(
        @Query('start') start?: Date,
        @Query('end') end?: Date,
        @Param('ingester') ingester?: AvailableIngesters
    ) {
        const startDate = start ? moment(start) : moment().startOf('day');
        const endDate = end ? moment(end) : moment().endOf('day');

        if (!ingester) {
            throw new Error('Ingester not found');
        }

        const currentDate = startDate.clone();

        while (currentDate.isSameOrBefore(endDate)) {
            const startOfDay = currentDate.clone().startOf('day');
            const endOfDay = currentDate.clone().endOf('day');

            const data = await this.genericIngester.getIngester(ingester)?.fetchRecords(startOfDay, endOfDay);
            await this.timescaleWriteService.writeData(data![0].entity, data![0].records);

            this.logger.log(`Indexed ${startOfDay.format('YYYY-MM-DD')}`);

            currentDate.add(1, 'day');
        }

        return {
            success: true,
            startDate,
            endDate,
        };
    }
}
