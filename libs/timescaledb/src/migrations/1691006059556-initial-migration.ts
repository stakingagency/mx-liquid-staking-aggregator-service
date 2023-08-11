import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1691006059556 implements MigrationInterface {
    name = 'InitialMigration1691006059556';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "data_api_accounts" ("timestamp" TIMESTAMP NOT NULL, "series" character varying NOT NULL, "key" character varying NOT NULL, "value" numeric(128,64) NOT NULL DEFAULT '0', CONSTRAINT "UQ_b7ad17e1992b55a52f2e8d4ec69" UNIQUE ("timestamp", "series", "key"), CONSTRAINT "PK_5aba2d4e8653daa13bb277a9583" PRIMARY KEY ("timestamp"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48d2bd5db2c08c8e6d080ac611" ON "data_api_accounts" ("series", "key") `);
        await queryRunner.query(`CREATE TABLE "data_api_exchanges" ("timestamp" TIMESTAMP NOT NULL, "series" character varying NOT NULL, "key" character varying NOT NULL, "value" numeric(128,64) NOT NULL DEFAULT '0', CONSTRAINT "UQ_18db130a82f028dc99e064b59e1" UNIQUE ("timestamp", "series", "key"), CONSTRAINT "PK_9feab2b793d1d9b3cbae8fcdc0a" PRIMARY KEY ("timestamp"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b01387b8ef9d70b6ff7b5fa3d4" ON "data_api_exchanges" ("series", "key") `);
        await queryRunner.query(`CREATE TABLE "data_api_quote_coins" ("identifier" character varying NOT NULL, "apiIdentifier" character varying NOT NULL, "dbIdentifier" character varying NOT NULL, "lastFetch" TIMESTAMP NOT NULL, CONSTRAINT "PK_9301d641fbc3cad85cbef5ad2c7" PRIMARY KEY ("identifier"))`);
        await queryRunner.query(`CREATE INDEX "IDX_babfb039dfeedf22a6129b1428" ON "data_api_quote_coins" ("dbIdentifier") `);
        await queryRunner.query(`CREATE INDEX "IDX_9301d641fbc3cad85cbef5ad2c" ON "data_api_quote_coins" ("identifier") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9301d641fbc3cad85cbef5ad2c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_babfb039dfeedf22a6129b1428"`);
        await queryRunner.query(`DROP TABLE "data_api_quote_coins"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b01387b8ef9d70b6ff7b5fa3d4"`);
        await queryRunner.query(`DROP TABLE "data_api_exchanges"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48d2bd5db2c08c8e6d080ac611"`);
        await queryRunner.query(`DROP TABLE "data_api_accounts"`);
    }

}
