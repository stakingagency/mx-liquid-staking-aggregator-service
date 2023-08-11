import { MigrationInterface, QueryRunner } from 'typeorm';

export class tokensTable1669021002964 implements MigrationInterface {
  name = 'tokensTable1669021002964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" numeric(128,64) NOT NULL DEFAULT '0', CONSTRAINT "UQ_TOKENS_ID" UNIQUE ("timestamp", "series", "key"), CONSTRAINT "PK_5f08bedb572a63584f71a5f3b5e" PRIMARY KEY ("id", "timestamp"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_207c2bdc596dac4923d44805b9" ON "tokens" ("series", "key") `,
    );
    await queryRunner.query(`SELECT create_hypertable('tokens', 'timestamp')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_207c2bdc596dac4923d44805b9"`,
    );
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
