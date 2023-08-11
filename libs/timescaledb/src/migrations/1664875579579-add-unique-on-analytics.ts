import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUniqueOnAnalytics1664875579579 implements MigrationInterface {
  name = 'addUniqueOnAnalytics1664875579579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" ADD CONSTRAINT "UQ_MAIAR_EXCHANGE_ANALYTICS_ID" UNIQUE ("timestamp", "series", "key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" DROP CONSTRAINT "UQ_MAIAR_EXCHANGE_ANALYTICS_ID"`,
    );
  }
}
