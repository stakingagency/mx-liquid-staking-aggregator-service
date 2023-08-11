// import { TABLE_PREFIX } from 'dist/libs/common/src/utils/contstants';
import { DataSource } from 'typeorm';

const TABLE_PREFIX = 'data_api_';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5431,
  database: 'timescaledb',
  username: 'timescaledb',
  password: 'password',
  entityPrefix: TABLE_PREFIX,
  migrationsTableName: `${TABLE_PREFIX}migrations`,
  entities: [
    'dist/libs/timescaledb/**/entities/*{.js,.ts}',
  ],
  migrations: [
    'dist/libs/timescaledb/**/migrations/*{.js,.ts}',
  ],
});
