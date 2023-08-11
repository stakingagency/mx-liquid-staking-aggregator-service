import { Injectable, Logger } from '@nestjs/common';
import {
    ElasticQuery,
    RangeQuery,
    RangeGreaterThan,
} from '@multiversx/sdk-nestjs-elastic';
import { ElasticService } from '@multiversx/sdk-nestjs-elastic';

@Injectable()
export class ElasticUtils {
    private readonly logger: Logger;

    constructor(private readonly elasticService: ElasticService) {
        this.logger = new Logger(ElasticService.name);
    }

    async getDetailedRangeCount(collection: string, key: string, gts: number[]) {
        const result = await Promise.all(
            gts.map(
                async (gt: number) =>
                    await this.elasticService.getCount(
                        collection,
                        ElasticQuery.create().withFilter(
                            new RangeQuery(key, [new RangeGreaterThan(gt)]),
                        ),
                    ),
            ),
        );
        return result;
    }

    public async computeAllItems(elasticUrl: string, collection: string, key: string, elasticQuery: ElasticQuery, computePage: (index: number, transactions: any[]) => Promise<void>) {
        let globalScrollId;

        try {
            const { scrollId, items: firstItems } = await this.getFirstPageUsingScrollApi(elasticUrl, collection, key, elasticQuery);
            globalScrollId = scrollId;

            let index = 0;
            let items = firstItems;
            while (items.length > 0) {
                await computePage(index, items);
                index++;
                items = await this.getNextPageUsingScrollApi(elasticUrl, scrollId, key);

                this.logger.log({ items: items.length, totalItems: index });
            }
        } finally {
            await this.removeScrollId(elasticUrl, globalScrollId);
        }
    }

    private async getFirstPageUsingScrollApi(elasticUrl: string, collection: string, key: string, elasticQuery: ElasticQuery) {
        try {
            const url = `${elasticUrl}/${collection}/_search?scroll=20m`;
            const result = await this.elasticService.post(url, elasticQuery.toJson());

            const scrollId = result._scroll_id;
            const items = result.hits.hits;

            return {
                scrollId,
                items: items.map((document: any) => this.formatItem(document, key)),
            };
        } catch (error) {
            this.logger.error(`An unhandled error occurred when fetching first page using scroll api`);
            this.logger.error(error);

            return { items: [] };
        }
    }

    async getNextPageUsingScrollApi(elasticUrl: string, scrollId: string, key: string): Promise<any[]> {
        try {
            const result = await this.elasticService.post(`${elasticUrl}/_search/scroll`, {
                scroll: '20m',
                scroll_id: scrollId,
            });

            await new Promise(resolve => setTimeout(resolve, 2500));

            return result.hits.hits.map((document: any) => this.formatItem(document, key));
        } catch (error) {
            this.logger.error(`An unhandled error occurred when fetching next page using scroll api`);
            this.logger.error(error);

            return [];
        }
    }

    async removeScrollId(elasticUrl: string, scrollId: string): Promise<boolean> {
        try {
            const result = await this.elasticService.delete(`${elasticUrl}/_search/scroll`, {
                scroll_id: scrollId,
            });

            return result.succeeded;
        } catch (error) {
            this.logger.error(`An unhandled error occurred when removing scroll with id '${scrollId}'`);
            this.logger.error(error);

            return false;
        }
    }

    private formatItem(document: any, key: string) {
        const { _id, _source } = document;
        const item: any = {};
        item[key] = _id;

        return { ...item, ..._source };
    }
}
