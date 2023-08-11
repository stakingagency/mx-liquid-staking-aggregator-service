import { MigrationInterface, QueryRunner } from 'typeorm';

export class storeQuoteChange24h1665753579882 implements MigrationInterface {
  name = 'storeQuoteChange24h1665753579882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quotes_latest" ADD "change24h" double precision NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quotes_latest" DROP COLUMN "change24h"`,
    );
  }
}
