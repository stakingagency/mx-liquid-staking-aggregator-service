import { MigrationInterface, QueryRunner } from 'typeorm';

export class todayMetrics1674753723549 implements MigrationInterface {
  name = 'todayMetrics1674753723549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hyper_today_metrics" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "UQ_HYPER_TODAY_METRICS" UNIQUE ("timestamp", "series", "key"), CONSTRAINT "PK_849d1114f5ae7ec0c14bd0505b2" PRIMARY KEY ("id", "timestamp"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5a0cdf079ddc2fdf7b5e12006a" ON "hyper_today_metrics" ("series", "key") `,
    );
    await queryRunner.query(
      `SELECT create_hypertable('hyper_today_metrics', 'timestamp', chunk_time_interval => INTERVAL '1 month')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5a0cdf079ddc2fdf7b5e12006a"`,
    );
    await queryRunner.query(`DROP TABLE "hyper_today_metrics"`);
  }
}
