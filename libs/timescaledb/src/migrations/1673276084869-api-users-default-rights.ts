import { MigrationInterface, QueryRunner } from 'typeorm';

export class apiUsersDefaultRights1673276084869 implements MigrationInterface {
  name = 'apiUsersDefaultRights1673276084869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "api_users" ALTER COLUMN "read" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "api_users" ALTER COLUMN "read" SET DEFAULT true`,
    );
  }
}
