import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ApiConfigService } from '../api-config';
import { ApiService, ApiSettings } from '@multiversx/sdk-nestjs-http';
import { LogPerformanceAsync } from '../../utils/decorators/log.performance.decorators';
import { MetricsEvents } from '../../utils/metrics-events.constants';

@Injectable()
export class GatewayService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
  ) { }

  @LogPerformanceAsync(MetricsEvents.SetGatewayDuration, { argIndex: 1 })
  async get(
    url: string,
    errorHandler?: (error: any) => Promise<boolean>,
  ): Promise<any> {
    const result = await this.getRaw(url, errorHandler);
    return result?.data?.data;
  }

  @LogPerformanceAsync(MetricsEvents.SetGatewayDuration, { argIndex: 1 })
  async getRaw(
    url: string,
    errorHandler?: (error: any) => Promise<boolean>,
  ): Promise<any> {
    return await this.apiService.get(
      `${this.apiConfigService.getGatewayUrl()}/${url}`,
      new ApiSettings(),
      errorHandler,
    );
  }

  async getEpoch(): Promise<number> {
    const {
      status: { erd_epoch_number },
    } = await this.get(
      'network/status/4294967295',
    );
    return erd_epoch_number;
  }
}
