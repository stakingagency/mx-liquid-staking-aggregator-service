import { MigrationInterface, QueryRunner } from 'typeorm';

export class quotesDescIndex1676650498513 implements MigrationInterface {
  name = 'quotesDescIndex1676650498513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "hyper_quotes_historical_timestamp_idx_desc" ON "public"."hyper_quotes_historical" ("timestamp" DESC,series,"key");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."hyper_quotes_historical_timestamp_idx_desc"`,
    );
  }
}
