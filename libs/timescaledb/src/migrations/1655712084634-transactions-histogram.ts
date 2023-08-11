import { MigrationInterface, QueryRunner } from 'typeorm';

export class transactionsHistogram1655712084634 implements MigrationInterface {
  name = 'transactionsHistogram1655712084634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transactions_histogram" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_bdac7ca4a8d7bb05b5efdb20a2a" PRIMARY KEY ("id", "timestamp"))`,
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX transactions_histogram_unique_idx ON public.transactions_histogram ("timestamp",series,"key")',
    );
    await queryRunner.query(
      `SELECT create_hypertable('transactions_histogram', 'timestamp')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."transactions_histogram_idx"`);
    await queryRunner.query(`DROP TABLE "transactions_histogram"`);
  }
}
