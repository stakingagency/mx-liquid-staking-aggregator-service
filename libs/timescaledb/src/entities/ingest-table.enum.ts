import { registerEnumType } from '@nestjs/graphql';

export enum IngestTableEnum {
  XEXCHANGE_ANALYTICS = 'hyper_xexchange_analytics',
}

registerEnumType(IngestTableEnum, { name: 'IngestTable' });
