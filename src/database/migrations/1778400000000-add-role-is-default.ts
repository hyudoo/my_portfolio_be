import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleIsDefault1778400000000 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD COLUMN "is_default" boolean NOT NULL DEFAULT false`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "is_default"`);
    }
}
