import { MigrationInterface, QueryRunner } from 'typeorm';

export class dexAnalyticsBignumber1661421403774 implements MigrationInterface {
  name = 'dexAnalyticsBignumber1661421403774';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" DROP COLUMN "value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" ADD "value" decimal(64,32) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" DROP COLUMN "value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" ADD "value" text NOT NULL`,
    );
  }
}
