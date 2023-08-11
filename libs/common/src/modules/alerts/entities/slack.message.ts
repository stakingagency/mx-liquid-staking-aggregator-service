export class SlackMessage {
  title: string = '';
  attachments: any[] = [];

  static buildIngesterErrorMessage(ingesterName: string, network: string) {
    const message = new SlackMessage();
    message.title = `${ingesterName} - Could not process ingester`;
    message.attachments = [
      {
        color: '#e01e5a',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*[${network.toUpperCase()}] ${ingesterName}* - Could not process ingester`,
            },
          },
        ],
      },
    ];
    return message;
  }

  static buildIngesterWarningMessage(
    ingesterName: string,
    warnings: string[],
    network: string,
  ) {
    const message = new SlackMessage();
    message.title = `${ingesterName} - Found ${warnings.length} data warnings`;
    message.attachments = [
      {
        color: '#ecb22e',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*[${network.toUpperCase()}] ${ingesterName}* - Found ${
                warnings.length
              } data warnings`,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Warnings:*\n${warnings
                  .map((w) => `• ${w}`)
                  .join('\n')}`,
              },
            ],
          },
        ],
      },
    ];
    return message;
  }
}
