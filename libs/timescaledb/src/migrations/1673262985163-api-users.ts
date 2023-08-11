import { MigrationInterface, QueryRunner } from 'typeorm';

export class apiUsers1673262985163 implements MigrationInterface {
  name = 'apiUsers1673262985163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "api_users" ("address" character varying NOT NULL, "host" character varying, "name" character varying, "read" boolean NOT NULL DEFAULT true, "write" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_fb55bc0e77e5b7a3309d592a672" PRIMARY KEY ("address"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb55bc0e77e5b7a3309d592a67" ON "api_users" ("address") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fb55bc0e77e5b7a3309d592a67"`,
    );
    await queryRunner.query(`DROP TABLE "api_users"`);
  }
}
