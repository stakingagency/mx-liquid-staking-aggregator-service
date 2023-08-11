import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTrends1688973875574 implements MigrationInterface {
  name = 'updateTrends1688973875574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trends" ADD CONSTRAINT "UQ_TRENDS_ID" UNIQUE ("timestamp", "series", "key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trends" DROP CONSTRAINT "UQ_TRENDS_ID"`,
    );
  }
}
