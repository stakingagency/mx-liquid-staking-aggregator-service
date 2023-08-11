import { MigrationInterface, QueryRunner } from 'typeorm';

export class dexAnalytics1660054661640 implements MigrationInterface {
  name = 'dexAnalytics1660054661640';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "maiar_exchange_analytics" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_b0c7748b95b2e524dcbc0c6c17c" PRIMARY KEY ("id", "timestamp"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "maiar_exchange_analytics"`);
  }
}
