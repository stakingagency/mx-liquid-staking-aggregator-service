import { MigrationInterface, QueryRunner } from "typeorm";

export class StakeTotal1691590763839 implements MigrationInterface {
    name = 'StakeTotal1691590763839';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "data_api_daily_volumes" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying NOT NULL, "key" character varying NOT NULL, "value" numeric(128,64) NOT NULL DEFAULT '0', CONSTRAINT "UQ_8bd26399742c43fa52003021218" UNIQUE ("timestamp", "series", "key"), CONSTRAINT "PK_8205f8f03e7d9c105625fefe3f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2c2ce96eb591f11d0d286d321b" ON "data_api_daily_volumes" ("series", "key") `);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" DROP CONSTRAINT "PK_5aba2d4e8653daa13bb277a9583"`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" ADD CONSTRAINT "PK_28913d9038323d1db15acf0f8c6" PRIMARY KEY ("timestamp", "id")`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" DROP CONSTRAINT "PK_9feab2b793d1d9b3cbae8fcdc0a"`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" ADD CONSTRAINT "PK_a0cb6af1f97be1b852350020784" PRIMARY KEY ("timestamp", "id")`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" DROP CONSTRAINT "UQ_b7ad17e1992b55a52f2e8d4ec69"`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" DROP CONSTRAINT "PK_28913d9038323d1db15acf0f8c6"`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" ADD CONSTRAINT "PK_5493496d02b6ceef31a1e845f02" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" DROP CONSTRAINT "UQ_18db130a82f028dc99e064b59e1"`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" DROP CONSTRAINT "PK_a0cb6af1f97be1b852350020784"`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" ADD CONSTRAINT "PK_5428808b8896e4ffd5065f93c7d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" ADD CONSTRAINT "UQ_b7ad17e1992b55a52f2e8d4ec69" UNIQUE ("timestamp", "series", "key")`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" ADD CONSTRAINT "UQ_18db130a82f028dc99e064b59e1" UNIQUE ("timestamp", "series", "key")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" DROP CONSTRAINT "UQ_18db130a82f028dc99e064b59e1"`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" DROP CONSTRAINT "UQ_b7ad17e1992b55a52f2e8d4ec69"`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" DROP CONSTRAINT "PK_5428808b8896e4ffd5065f93c7d"`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" ADD CONSTRAINT "PK_a0cb6af1f97be1b852350020784" PRIMARY KEY ("timestamp", "id")`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" ADD CONSTRAINT "UQ_18db130a82f028dc99e064b59e1" UNIQUE ("timestamp", "series", "key")`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" DROP CONSTRAINT "PK_5493496d02b6ceef31a1e845f02"`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" ADD CONSTRAINT "PK_28913d9038323d1db15acf0f8c6" PRIMARY KEY ("timestamp", "id")`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" ADD CONSTRAINT "UQ_b7ad17e1992b55a52f2e8d4ec69" UNIQUE ("timestamp", "series", "key")`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" DROP CONSTRAINT "PK_a0cb6af1f97be1b852350020784"`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" ADD CONSTRAINT "PK_9feab2b793d1d9b3cbae8fcdc0a" PRIMARY KEY ("timestamp")`);
        await queryRunner.query(`ALTER TABLE "data_api_exchanges" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" DROP CONSTRAINT "PK_28913d9038323d1db15acf0f8c6"`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" ADD CONSTRAINT "PK_5aba2d4e8653daa13bb277a9583" PRIMARY KEY ("timestamp")`);
        await queryRunner.query(`ALTER TABLE "data_api_accounts" DROP COLUMN "id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c2ce96eb591f11d0d286d321b"`);
        await queryRunner.query(`DROP TABLE "data_api_daily_volumes"`);
    }

}
