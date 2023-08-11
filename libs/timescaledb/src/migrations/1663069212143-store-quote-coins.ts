import { MigrationInterface, QueryRunner } from 'typeorm';

export class storeQuoteCoins1663069212143 implements MigrationInterface {
  name = 'storeQuoteCoins1663069212143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "quote_coins" ("id" SERIAL NOT NULL, "identifier" character varying NOT NULL, "apiIdentifier" character varying NOT NULL, "dbIdentifier" character varying NOT NULL, "lastFetch" TIMESTAMP NOT NULL, CONSTRAINT "PK_d4fd6d282fa38af865768db6015" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ec14b8a71f09533abd910b9477" ON "quote_coins" ("identifier") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ec14b8a71f09533abd910b9477"`,
    );
    await queryRunner.query(`DROP TABLE "quote_coins"`);
  }
}
