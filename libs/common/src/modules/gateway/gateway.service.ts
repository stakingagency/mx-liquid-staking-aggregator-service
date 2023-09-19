import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ApiConfigService } from '../api-config';
import { ApiService, ApiSettings } from '@multiversx/sdk-nestjs-http';
import {GatewayQueryBody} from "./entities/gateway.query.body";

@Injectable()
export class GatewayService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
  ) { }

  async get(
    url: string,
    errorHandler?: (error: any) => Promise<boolean>,
  ): Promise<any> {
    const result = await this.getRaw(url, errorHandler);
    return result?.data?.data;
  }

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

  async query(data: GatewayQueryBody, errorHandler?: (error: any) => Promise<boolean>,): Promise<any> {
    const result = await this.queryRaw(data, errorHandler);
    return result?.data?.data?.data;
  }

  private async queryRaw(data: GatewayQueryBody, errorHandler?: (error: any) => Promise<boolean>,): Promise<any> {
    return await this.apiService.post(
        `${this.apiConfigService.getGatewayUrl()}/vm-values/query`,
        data,
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
