import { MigrationInterface, QueryRunner } from 'typeorm';

export class dexAnalyticsUpdate1661418553991 implements MigrationInterface {
  name = 'dexAnalyticsUpdate1661418553991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" DROP COLUMN "value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" ADD "value" text NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6ada22746f151b27887c752a0c" ON "maiar_exchange_analytics" ("series", "key") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6ada22746f151b27887c752a0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" DROP COLUMN "value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" ADD "value" character varying NOT NULL`,
    );
  }
}
