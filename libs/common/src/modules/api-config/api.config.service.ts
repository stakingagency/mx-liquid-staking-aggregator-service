import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NetworkType } from '../../entities';
import { Exchange } from '../exchanges';

@Injectable()
export class ApiConfigService implements ApiConfigService {
  constructor(private readonly config: ConfigService) { }

  getNetwork(): NetworkType {
    return this.getGenericConfig('network', {
      defaultValue: NetworkType.MAINNET,
    });
  }

  getApiPort(): number {
    return this.getGenericConfig('apps.api.port');
  }

  getAggregator(): number {
    return this.getGenericConfig('apps.aggregator.port');
  }

  getApiPrefix(): string {
    return this.getGenericConfig('apps.api.prefix');
  }

  getIngestersPort(): number {
    return this.getGenericConfig('apps.ingesters.port');
  }

  getIndexerPort(): number {
    return this.getGenericConfig('apps.indexer.port');
  }

  getRedisUrl(): string {
    return this.getGenericConfig('urls.redis');
  }

  getRateLimiterSecret(): string | null {
    return this.getGenericConfig('rateLimiterSecret', { defaultValue: null });
  }

  getUseKeepAliveAgentFlag(): boolean {
    return this.getGenericConfig('flags.useKeepAliveAgent', { defaultValue: true });
  }

  getAxiosTimeout(): number {
    return this.getGenericConfig('keepAliveTimeout.downstream', { defaultValue: 61000 });
  }

  getServerTimeout(): number {
    return this.getGenericConfig('keepAliveTimeout.upstream', { defaultValue: 60000 });
  }

  getHeadersTimeout(): number {
    return this.getServerTimeout() + 1000;
  }

  getSlackWebhookUrl(): string | null {
    return this.getGenericConfig('slack.webhookUrl', { defaultValue: null });
  }

  getTimescaleConnection(): {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    poolSize: number;
  } {
    return {
      host: this.getTimescaleHost(),
      port: this.getTimescalePort(),
      database: this.getTimescaleDatabase(),
      username: this.getTimescaleUsername(),
      password: this.getTimescalePassword(),
      poolSize: this.getGenericConfig('timescale.poolSize', { defaultValue: 4 }),
    };
  }

  getElasticUrl(): string {
    return this.getGenericConfig('urls.elastic');
  }

  getInternalElasticUrl(): string {
    return this.getGenericConfig('urls.internalElastic');
  }

  getApiUrl(): string {
    return this.getGenericConfig('urls.api');
  }

  getDataApi(): string {
    return this.getGenericConfig('urls.dataApi');
  }

  getExchanges(): Exchange[] {
    return this.config.get<Exchange[]>('exchanges') ?? [];
  }

  getGatewayUrl(): string {
    return this.getGenericConfig('urls.gateway');
  }

  getLightGatewayUrl(): string | undefined {
    return this.getGenericConfig('urls.lightGateway');
  }

  getTimescaleHost(): string {
    return this.getGenericConfig('timescale.host');
  }

  getTimescaleUsername(): string {
    return this.getGenericConfig('timescale.username');
  }

  getTimescalePassword(): string {
    return this.getGenericConfig('timescale.password');
  }

  getTimescaleDatabase(): string {
    return this.getGenericConfig('timescale.database');
  }

  getTimescalePort(): number {
    return this.getGenericConfig('timescale.port');
  }

  getGenericConfig<T>(key: string, options?: { defaultValue: T }): T {
    const config = this.config.get<T>(key);

    if (config === undefined && options) {
      return options.defaultValue;
    }

    if (config === undefined) {
      throw new Error(`No ${key} present`);
    }

    return config;
  }
}
