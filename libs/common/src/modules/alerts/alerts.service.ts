import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../api-config/api.config.service';
import { SlackMessage } from './entities';
import { OriginLogger } from '@multiversx/sdk-nestjs-common';
import { ApiService } from '@multiversx/sdk-nestjs-http';

@Injectable()
export class AlertsService {
  private readonly logger = new OriginLogger(AlertsService.name);

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
  ) { }

  public async sendIngesterWarning(ingesterName: string, warnings: string[]): Promise<void> {
    const message = SlackMessage.buildIngesterWarningMessage(
      ingesterName,
      warnings,
      this.apiConfigService.getNetwork(),
    );
    await this.sendAlert(message);
  }

  public async sendIngesterError(ingesterName: string): Promise<void> {
    const message = SlackMessage.buildIngesterErrorMessage(
      ingesterName,
      this.apiConfigService.getNetwork(),
    );
    await this.sendAlert(message);
  }

  private async sendAlert(message: SlackMessage): Promise<void> {
    try {
      const slackWebhookUrl = this.apiConfigService.getSlackWebhookUrl();
      if (!slackWebhookUrl) {
        this.logger.warn(`Could not send Slack message with title '${message.title}'. No slack webhook was provided`,);
        return;
      }

      await this.apiService.post(slackWebhookUrl, message);

      this.logger.log(`Send Slack message with title '${message.title}'`);
    } catch (error) {
      this.logger.error(
        `Could not send Slack message with title '${message.title}'`,
      );
      this.logger.error(error);
    }
  }
}
