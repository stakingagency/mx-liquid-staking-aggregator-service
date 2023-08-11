import { Controller, Get } from '@nestjs/common';
import { ApiMetricsService } from './api.metrics.service';

@Controller()
export class ApiMetricsController {
  constructor(private readonly metrics: ApiMetricsService) {}

  @Get('/metrics')
  async getMetrics(): Promise<string> {
    return await this.metrics.getMetrics();
  }
}
