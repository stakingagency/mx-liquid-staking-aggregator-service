import { MigrationInterface, QueryRunner } from 'typeorm';

export class exchangeAnalyticsDescIndex1676545475100
  implements MigrationInterface
{
  name = 'exchangeAnalyticsDescIndex1676545475100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "hyper_xexchange_analytics_timestamp_idx_desc" ON "public"."hyper_xexchange_analytics" ("timestamp" DESC,series,"key");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."hyper_xexchange_analytics_timestamp_idx_desc"`,
    );
  }
}
