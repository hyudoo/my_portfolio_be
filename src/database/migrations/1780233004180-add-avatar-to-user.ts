import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarToUser1780233004180 implements MigrationInterface {
    name = "AddAvatarToUser1780233004180";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "avatar_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "files"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_256f20ad82b57a4aa9c6a6f63f" ON "project_categories" ("order")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3bfc335a820cd095bcb97bbc89" ON "projects" ("order")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_3bfc335a820cd095bcb97bbc89"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_256f20ad82b57a4aa9c6a6f63f"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "avatar_id"
        `);
    }
}
