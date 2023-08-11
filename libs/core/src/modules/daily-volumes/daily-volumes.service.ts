import { ApiConfigService } from '@libs/common';
import { ElasticQuery, ElasticService, ElasticSortOrder, QueryType } from '@multiversx/sdk-nestjs-elastic';
import { ApiService } from '@multiversx/sdk-nestjs-http';
import { Injectable } from '@nestjs/common';
import { RecordData } from 'libs/core/src/modules/daily-volumes/entities/record.data';
import { TokenData } from 'libs/core/src/modules/daily-volumes/entities/token.data';
import BigNumber from 'bignumber.js';
import { Moment } from 'moment';

@Injectable()
export class DailyVolumesService {
    constructor(
        private readonly elasticService: ElasticService,
        private readonly apiSerivce: ApiService,
        private readonly apiConfigService: ApiConfigService,
    ) { }

    private async getTokensListed(identifiers: string[]): Promise<TokenData[]> {
        const identifiersCommaSeparated = identifiers.join(',');
        const identifiersLength = identifiers.length;
        const { data: tokensListed } = await this.apiSerivce.get(`${this.apiConfigService.getApiUrl()}/tokens?identifiers=${identifiersCommaSeparated}&size=${identifiersLength}&type=FungibleESDT&fields=identifier,decimals`);
        return tokensListed;
    }

    private async getDataApiTokens(): Promise<string[]> {
        const { data } = await this.apiSerivce.get(`${this.apiConfigService.getDataApi()}/v1/tokens/xexchange?fields=identifier`);
        const tokensDataApi = data.map((tokenDataApi: { identifier: string }) => tokenDataApi.identifier);
        return tokensDataApi;
    }

    async getTokenPrice(identifier: string, date: string): Promise<number> {
        switch (identifier) {
            case 'EGLD':
                const { data: egldToken } = await this.apiSerivce.get(`${this.apiConfigService.getDataApi()}/v1/quotes/cex/EGLD?date=${date}`);
                return egldToken.price;
            default:
                const { data: token } = await this.apiSerivce.get(`${this.apiConfigService.getDataApi()}/v1/quotes/xexchange/${identifier}?date=${date}`);
                return token.price;
        }
    }

    private handleItem(
        tokensListed: TokenData[],
        token: string,
        value: string,
        timestamp: number,
        data: Map<string, RecordData>
    ) {
        const tokenData = tokensListed.find((tokenData: TokenData) => tokenData.identifier === token);
        const decimals = tokenData?.decimals;

        const existingData: RecordData = data.get(token) || { timestamp: 0, decimals: 0, value: new BigNumber(0) };
        existingData.timestamp = timestamp;
        existingData.decimals = decimals || 0;
        existingData.value = new BigNumber(existingData.value.toString()).plus(new BigNumber(value));

        data.set(token, existingData);
    }

    async fetchVolumes(startDate: Moment, endDate: Moment) {
        try {
            const before = endDate.unix();
            const after = startDate.unix();
            const recordData = new Map<string, RecordData>();

            const tokensDataApi = await this.getDataApiTokens();
            const tokensListed = await this.getTokensListed(tokensDataApi);

            const elasticQuery = ElasticQuery.create()
                .withMustCondition(
                    QueryType.Should([
                        QueryType.Exists('tokens'),
                        QueryType.Exists('value'),
                    ])
                )
                .withFields(['tokens', 'esdtValues', 'timestamp', 'value'])
                .withSort([{ name: 'timestamp', order: ElasticSortOrder.ascending }])
                .withPagination({ from: 0, size: 10000 })
                .withDateRangeFilter('timestamp', before, after);

            await this.elasticService.getScrollableList(
                'operations',
                'identifier',
                elasticQuery,
                // eslint-disable-next-line require-await
                async (items) => {
                    for (const item of items) {
                        if (item.value !== '0') {
                            const existingDataValue = recordData.get('EGLD')?.value || new BigNumber(0);
                            recordData.set('EGLD', {
                                timestamp: item.timestamp,
                                decimals: 18,
                                value: existingDataValue.plus(new BigNumber(item.value)),
                            });
                        } else if (item.tokens) {
                            item.tokens.forEach((token: string, index: number) => {
                                if (tokensDataApi.includes(token)) {
                                    this.handleItem(
                                        tokensListed,
                                        token,
                                        item.esdtValues[index],
                                        item.timestamp,
                                        recordData);
                                }
                            });
                        }
                    }
                }
            );

            return recordData;
        } catch (error) {
            console.log(error);
            return new Map<string, RecordData>();
        }
    }

    async getValuesSum(startDate: Moment, endDate: Moment) {
        try {
            const records = await this.fetchVolumes(startDate, endDate);

            let valuesSum = new BigNumber(0);

            for (const [key, record] of records.entries()) {
                const { decimals, value, timestamp } = record;
                const date = new Date(timestamp * 1000).toISOString().split('T')[0];
                const dailyPrice = await this.getTokenPrice(key, date);
                const dailyVolume = value.dividedBy(10 ** decimals);
                const dailyValue = new BigNumber(dailyPrice).multipliedBy(dailyVolume);
                valuesSum = valuesSum.plus(dailyValue);
            }

            return valuesSum;
        } catch (error) {
            console.log(error);
            return new BigNumber(0);
        }
    }
}
