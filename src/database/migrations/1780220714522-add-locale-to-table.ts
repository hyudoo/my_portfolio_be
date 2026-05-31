import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocaleToTable1780220714522 implements MigrationInterface {
    name = "AddLocaleToTable1780220714522";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_47dd0ade7ed449a7aca9b9e675"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_project_categories_order"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_projects_order"
        `);
        await queryRunner.query(`
            ALTER TABLE "skill_categories"
            ADD "locale" character varying(10) NOT NULL DEFAULT 'vi'
        `);
        await queryRunner.query(`
            ALTER TABLE "skills"
            ADD "locale" character varying(10) NOT NULL DEFAULT 'vi'
        `);
        await queryRunner.query(`
            ALTER TABLE "settings"
            ADD "locale" character varying(10) NOT NULL DEFAULT 'vi'
        `);
        await queryRunner.query(`
            ALTER TABLE "settings"
            ADD CONSTRAINT "UQ_bd8143eb211e2a420e180212efb" UNIQUE ("locale")
        `);
        await queryRunner.query(`
            ALTER TABLE "project_categories"
            ADD "locale" character varying(10) NOT NULL DEFAULT 'vi'
        `);
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD "locale" character varying(10) NOT NULL DEFAULT 'vi'
        `);
        await queryRunner.query(`
            ALTER TABLE "skill_categories" DROP COLUMN "order"
        `);
        await queryRunner.query(`
            ALTER TABLE "skill_categories"
            ADD "order" text NOT NULL DEFAULT 'a0'
        `);
        await queryRunner.query(`
            ALTER TABLE "skills" DROP COLUMN "order"
        `);
        await queryRunner.query(`
            ALTER TABLE "skills"
            ADD "order" text NOT NULL DEFAULT 'a0'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_be7b721dce346a1c2830e9e847" ON "skill_categories" ("order")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ef1e86e145e528e0d137af8af6" ON "skills" ("category_id", "order")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ef1e86e145e528e0d137af8af6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_be7b721dce346a1c2830e9e847"
        `);
        await queryRunner.query(`
            ALTER TABLE "skills" DROP COLUMN "order"
        `);
        await queryRunner.query(`
            ALTER TABLE "skills"
            ADD "order" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "skill_categories" DROP COLUMN "order"
        `);
        await queryRunner.query(`
            ALTER TABLE "skill_categories"
            ADD "order" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "projects" DROP COLUMN "locale"
        `);
        await queryRunner.query(`
            ALTER TABLE "project_categories" DROP COLUMN "locale"
        `);
        await queryRunner.query(`
            ALTER TABLE "settings" DROP CONSTRAINT "UQ_bd8143eb211e2a420e180212efb"
        `);
        await queryRunner.query(`
            ALTER TABLE "settings" DROP COLUMN "locale"
        `);
        await queryRunner.query(`
            ALTER TABLE "skills" DROP COLUMN "locale"
        `);
        await queryRunner.query(`
            ALTER TABLE "skill_categories" DROP COLUMN "locale"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_projects_order" ON "projects" ("order")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_project_categories_order" ON "project_categories" ("order")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_47dd0ade7ed449a7aca9b9e675" ON "skills" ("category_id")
        `);
    }
}
