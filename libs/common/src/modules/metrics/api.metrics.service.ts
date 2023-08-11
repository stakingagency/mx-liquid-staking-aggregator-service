import { MetricsService } from '@multiversx/sdk-nestjs-monitoring';
import { Injectable } from '@nestjs/common';
import { register } from 'prom-client';

@Injectable()
export class ApiMetricsService {
  constructor(private readonly metrics: MetricsService) {}

  async getMetrics(): Promise<string> {
    const baseMetrics = await this.metrics.getMetrics();
    const currentMetrics = await register.metrics();

    return baseMetrics + '\n' + currentMetrics;
  }
}
