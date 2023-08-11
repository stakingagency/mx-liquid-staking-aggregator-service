import { MigrationInterface, QueryRunner } from 'typeorm';

export class priceAggregator1659948607474 implements MigrationInterface {
  name = 'priceAggregator1659948607474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "price-aggregator" ("id" BIGSERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "address" character varying NOT NULL, "from" character varying NOT NULL, "to" character varying NOT NULL, "price" double precision NOT NULL, CONSTRAINT "UQ_PRICE_AGGREGATOR_ID" UNIQUE ("timestamp", "address", "from", "to"), CONSTRAINT "PK_43549624c95918d51f9621e15b7" PRIMARY KEY ("id", "timestamp"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35908149a365768022b91d0ddf" ON "price-aggregator" ("from", "to") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_35908149a365768022b91d0ddf"`,
    );
    await queryRunner.query(`DROP TABLE "price-aggregator"`);
  }
}
