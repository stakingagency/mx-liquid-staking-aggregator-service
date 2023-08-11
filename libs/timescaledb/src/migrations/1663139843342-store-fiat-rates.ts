import { MigrationInterface, QueryRunner } from 'typeorm';

export class storeFiatRates1663139843342 implements MigrationInterface {
  name = 'storeFiatRates1663139843342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fiat" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_3c1138ecff44d6587499918ca02" PRIMARY KEY ("id", "timestamp"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f9b33b4c7618b76eef6b083151" ON "fiat" ("series", "key") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9fb42d7ded07c80f41645acd83" ON "fiat" ("series") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_683237a702256e473303d05765" ON "quote_coins" ("dbIdentifier") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_683237a702256e473303d05765"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9fb42d7ded07c80f41645acd83"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f9b33b4c7618b76eef6b083151"`,
    );
    await queryRunner.query(`DROP TABLE "fiat"`);
  }
}
