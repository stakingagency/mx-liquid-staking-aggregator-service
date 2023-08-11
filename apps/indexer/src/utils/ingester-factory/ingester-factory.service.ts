
import { Injectable } from '@nestjs/common';
import { DailyVolumesIngester } from 'apps/ingester/src/ingesters/daily-volumes';

@Injectable()
export class IngesterFactoryService {
    constructor(
        private readonly dailyVolumesIngester: DailyVolumesIngester,
    ) { }

    //TODO: Add more ingesters here when indxing is needed
    getIngester(ingesterName: string) {
        switch (ingesterName) {
            case 'daily-volumes':
                return this.dailyVolumesIngester;
            default:
                throw new Error(`Ingester ${ingesterName} not found`);
        }
    }
}
