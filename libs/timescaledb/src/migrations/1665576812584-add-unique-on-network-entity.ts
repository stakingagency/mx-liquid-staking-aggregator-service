import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUniqueOnNetworkEntity1665576812584
  implements MigrationInterface
{
  name = 'addUniqueOnNetworkEntity1665576812584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "network" ADD CONSTRAINT "UQ_NETWORK_ID" UNIQUE ("timestamp", "series", "key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "network" DROP CONSTRAINT "UQ_NETWORK_ID"`,
    );
  }
}
