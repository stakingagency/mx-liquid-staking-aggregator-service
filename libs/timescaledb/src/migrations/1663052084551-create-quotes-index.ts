import { MigrationInterface, QueryRunner } from 'typeorm';

export class createQuotesIndex1663052084551 implements MigrationInterface {
  name = 'createQuotesIndex1663052084551';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_94aaf051289a0349239e3ddf31" ON "quotes_historical" ("series", "key") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6783c220d4d8d488f36fe125e5" ON "quotes" ("series", "key") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6783c220d4d8d488f36fe125e5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_94aaf051289a0349239e3ddf31"`,
    );
  }
}
