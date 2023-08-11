import { MigrationInterface, QueryRunner } from "typeorm";

export class DailyValues1691491030222 implements MigrationInterface {
    name = 'DailyValues1691491030222';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "data_api_daily_volumes" ("timestamp" TIMESTAMP NOT NULL, "series" character varying NOT NULL, "key" character varying NOT NULL, "value" numeric(128,64) NOT NULL DEFAULT '0', CONSTRAINT "UQ_8bd26399742c43fa52003021218" UNIQUE ("timestamp", "series", "key"), CONSTRAINT "PK_a38cbf97e371159089671ffebea" PRIMARY KEY ("timestamp"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2c2ce96eb591f11d0d286d321b" ON "data_api_daily_volumes" ("series", "key") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2c2ce96eb591f11d0d286d321b"`);
        await queryRunner.query(`DROP TABLE "data_api_daily_volumes"`);
    }

}
