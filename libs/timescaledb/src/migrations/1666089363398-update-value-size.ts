import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateValueSize1666089363398 implements MigrationInterface {
  name = 'updateValueSize1666089363398';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" ALTER COLUMN "value" TYPE numeric(128,64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "network" ALTER COLUMN "value" TYPE numeric(128,64)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "network" ALTER COLUMN "value" TYPE numeric(64,32)`,
    );
    await queryRunner.query(
      `ALTER TABLE "maiar_exchange_analytics" ALTER COLUMN "value" TYPE numeric(64,32)`,
    );
  }
}
