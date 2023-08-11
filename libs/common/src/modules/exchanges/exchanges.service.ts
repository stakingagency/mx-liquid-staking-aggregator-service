import { Injectable } from "@nestjs/common";
import { Exchange } from "./entities";
import { OriginLogger } from "@multiversx/sdk-nestjs-common";
import { ApiConfigService } from "../api-config";
import { ElasticQuery, TermsQuery, RangeGreaterThanOrEqual, RangeLowerThan } from "@multiversx/sdk-nestjs-elastic";
import { BigNumber } from "bignumber.js";
import { UtilConstants } from "../../utils/contstants";
import { ElasticUtils } from "../../utils/elastic.utils";
import moment from "moment";

@Injectable()
export class ExchangesService {
  private readonly logger = new OriginLogger(ExchangesService.name);

  constructor(
    private readonly elasticUtils: ElasticUtils,
    private readonly apiConfigService: ApiConfigService,
  ) { }

  public getExchanges(): Exchange[] {
    return this.apiConfigService.getExchanges();
  }

  public getExchange(identifier: string): Exchange | undefined {
    const exchanges = this.getExchanges();
    return exchanges.find((exchange) => exchange.identifier === identifier);
  }

  public async getExchangeInflows(addresses: string[], startDate: moment.Moment, endDate: moment.Moment): Promise<BigNumber> {
    this.logger.log(`Computing exchange inflows between ${startDate.format(UtilConstants.sqlDateFormat())} and ${endDate.format(UtilConstants.sqlDateFormat())}. Addresses: ${addresses.join()}`);

    const elasticQuery = ElasticQuery.create()
      .withFields(['value'])
      .withPagination({ from: 0, size: 10000 })
      .withMustMatchCondition('status', 'success')
      .withRangeFilter('timestamp', new RangeGreaterThanOrEqual(startDate.unix()), new RangeLowerThan(endDate.unix()))
      .withTerms(new TermsQuery('receiver', addresses));

    let totalValue = new BigNumber(0);

    // eslint-disable-next-line require-await
    await this.elasticUtils.computeAllItems(this.apiConfigService.getElasticUrl(), 'transactions', 'hash', elasticQuery, async (_index: number, transactions: any[]) => {
      for (const transaction of transactions) {
        totalValue = totalValue.plus(new BigNumber(transaction.value));
      }
    });

    return totalValue;
  }

  public async getExchangeOutflows(addresses: string[], startDate: moment.Moment, endDate: moment.Moment): Promise<BigNumber> {
    this.logger.log(`Computing exchange outflows between ${startDate.format(UtilConstants.sqlDateFormat())} and ${endDate.format(UtilConstants.sqlDateFormat())}. Addresses: ${addresses.join()}`);

    const elasticQuery = ElasticQuery.create()
      .withFields(['value'])
      .withPagination({ from: 0, size: 10000 })
      .withMustMatchCondition('status', 'success')
      .withRangeFilter('timestamp', new RangeGreaterThanOrEqual(startDate.unix()), new RangeLowerThan(endDate.unix()))
      .withTerms(new TermsQuery('sender', addresses));

    let totalValue = new BigNumber(0);

    // eslint-disable-next-line require-await
    await this.elasticUtils.computeAllItems(this.apiConfigService.getElasticUrl(), 'transactions', 'hash', elasticQuery, async (_index: number, transactions: any[]) => {
      for (const transaction of transactions) {
        totalValue = totalValue.plus(new BigNumber(transaction.value));
      }
    });

    return totalValue;
  }
}
