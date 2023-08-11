import { MigrationInterface, QueryRunner } from 'typeorm';

export class remoteConfigs1673856483158 implements MigrationInterface {
  name = 'remoteConfigs1673856483158';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "remote_configs" ("name" character varying NOT NULL, "value" json NOT NULL, CONSTRAINT "PK_48049433a37f86eee54fae22830" PRIMARY KEY ("name"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_48049433a37f86eee54fae2283" ON "remote_configs" ("name") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_48049433a37f86eee54fae2283"`,
    );
    await queryRunner.query(`DROP TABLE "remote_configs"`);
  }
}
