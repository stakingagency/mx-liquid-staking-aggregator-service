import { CronExpression as NestCronExpression } from '@nestjs/schedule';

enum NewCronExpression {
  EVERY_DAY_AT_12_10AM = '10 0 * * *',
  EVERY_DAY_AT_2_15AM = '15 2 * * * *',
  EVERY_DAY_AT_4_25AM = '25 4 * * * *',
  EVERY_DAY_AT_5_20AM = '20 5 * * * *',
  EVERY_FRIDAY_AT_12_10AM = '10 0 * * 5',
}

export const CronExpression = {
  ...NestCronExpression,
  ...NewCronExpression,
};
export type CronExpression = typeof CronExpression;
