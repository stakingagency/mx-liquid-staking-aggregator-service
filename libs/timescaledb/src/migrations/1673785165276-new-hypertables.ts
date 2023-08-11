import { MigrationInterface, QueryRunner } from 'typeorm';

export class newHypertables1673785165276 implements MigrationInterface {
  name = 'newHypertables1673785165276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hyper_quotes_historical" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "UQ_HYPER_QUOTES_HISTORICAL" UNIQUE ("timestamp", "series", "key"), CONSTRAINT "PK_6a5cd372abde5655b4d91a97a18" PRIMARY KEY ("id", "timestamp"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_102fd9f189e3c619f6ce644882" ON "hyper_quotes_historical" ("series", "key") `,
    );
    await queryRunner.query(
      `SELECT create_hypertable('hyper_quotes_historical', 'timestamp', chunk_time_interval => INTERVAL '1 month')`,
    );

    await queryRunner.query(
      `CREATE TABLE "hyper_xexchange_analytics" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" numeric(128,64) NOT NULL DEFAULT '0', CONSTRAINT "UQ_XEXCHANGE_ANALYTICS_ID" UNIQUE ("timestamp", "series", "key"), CONSTRAINT "PK_b995aa690ed2358e38813f25f0e" PRIMARY KEY ("id", "timestamp"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6bedf018badc5d341c070d643c" ON "hyper_xexchange_analytics" ("series", "key") `,
    );
    await queryRunner.query(
      `SELECT create_hypertable('hyper_xexchange_analytics', 'timestamp', chunk_time_interval => INTERVAL '1 month')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6bedf018badc5d341c070d643c"`,
    );
    await queryRunner.query(`DROP TABLE "hyper_xexchange_analytics"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_102fd9f189e3c619f6ce644882"`,
    );
    await queryRunner.query(`DROP TABLE "hyper_quotes_historical"`);
  }
}
