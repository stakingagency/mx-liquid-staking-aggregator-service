import { MigrationInterface, QueryRunner } from 'typeorm';

export class storeLatestQuotes1664210969612 implements MigrationInterface {
  name = 'storeLatestQuotes1664210969612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "quotes_latest" ("identifier" character varying NOT NULL, "price" double precision NOT NULL, "marketCap" double precision NOT NULL, "volume24h" double precision NOT NULL, "circulatingSupply" double precision NOT NULL, "rank" double precision NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_abea2a6611adeb599fd8f422595" PRIMARY KEY ("identifier"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "quotes_latest"`);
  }
}
