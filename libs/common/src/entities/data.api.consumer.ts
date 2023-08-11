import { ApiUserEntity } from 'libs/timescaledb/src/entities/api.users.entity';

export interface DataApiConsumer {
  apiUser: ApiUserEntity;
  hosts: [string, string];
}
