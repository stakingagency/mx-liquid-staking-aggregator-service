import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNetworkEntity1665575571828 implements MigrationInterface {
  name = 'addNetworkEntity1665575571828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "network" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_d19b08eda35b4e46bc1c10cfd0b" PRIMARY KEY ("id", "timestamp"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b4794fde1b95cd177bd17b966" ON "network" ("series", "key") `,
    );
    await queryRunner.query(`SELECT create_hypertable('network', 'timestamp')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b4794fde1b95cd177bd17b966"`,
    );
    await queryRunner.query(`DROP TABLE "network"`);
  }
}
