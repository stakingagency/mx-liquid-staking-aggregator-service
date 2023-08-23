import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertsService {
  // private readonly logger = new OriginLogger(AlertsService.name);
  //
  // constructor(
  //   private readonly apiConfigService: ApiConfigService,
  //   private readonly apiService: ApiService,
  // ) { }
  // private async sendAlert(message: SlackMessage): Promise<void> {
  //   try {
  //     const slackWebhookUrl = this.apiConfigService.getSlackWebhookUrl();
  //     if (!slackWebhookUrl) {
  //       this.logger.warn(`Could not send Slack message with title '${message.title}'. No slack webhook was provided`,);
  //       return;
  //     }
  //
  //     await this.apiService.post(slackWebhookUrl, message);
  //
  //     this.logger.log(`Send Slack message with title '${message.title}'`);
  //   } catch (error) {
  //     this.logger.error(
  //       `Could not send Slack message with title '${message.title}'`,
  //     );
  //     this.logger.error(error);
  //   }
  // }
}
