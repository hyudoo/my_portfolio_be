import { MigrationInterface, QueryRunner } from "typeorm";

export class FractionalOrderProjects1780153906735 implements MigrationInterface {
    name = "FractionalOrderProjects1780153906735";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // project_categories: convert integer order to fractional text keys
        await queryRunner.query(`ALTER TABLE "project_categories" ADD COLUMN "order_new" TEXT`);
        await queryRunner.query(`
      UPDATE "project_categories" pc
      SET "order_new" = 'a' || (rn - 1)::text
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY "order") AS rn
        FROM "project_categories"
      ) ranked
      WHERE pc.id = ranked.id
    `);
        await queryRunner.query(`ALTER TABLE "project_categories" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "project_categories" RENAME COLUMN "order_new" TO "order"`);
        await queryRunner.query(`ALTER TABLE "project_categories" ALTER COLUMN "order" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_categories" ALTER COLUMN "order" SET DEFAULT 'a0'`);
        await queryRunner.query(`CREATE INDEX "IDX_project_categories_order" ON "project_categories" ("order")`);

        // projects: convert integer order to fractional text keys
        await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN "order_new" TEXT`);
        await queryRunner.query(`
      UPDATE "projects" p
      SET "order_new" = 'a' || (rn - 1)::text
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY "order") AS rn
        FROM "projects"
      ) ranked
      WHERE p.id = ranked.id
    `);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "projects" RENAME COLUMN "order_new" TO "order"`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "order" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "order" SET DEFAULT 'a0'`);
        await queryRunner.query(`CREATE INDEX "IDX_projects_order" ON "projects" ("order")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_projects_order"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN "order_old" INTEGER DEFAULT 0`);
        await queryRunner.query(`
      UPDATE "projects" p
      SET "order_old" = rn
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY "order") AS rn
        FROM "projects"
      ) ranked
      WHERE p.id = ranked.id
    `);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "projects" RENAME COLUMN "order_old" TO "order"`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "order" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "order" SET DEFAULT 0`);

        await queryRunner.query(`DROP INDEX "public"."IDX_project_categories_order"`);
        await queryRunner.query(`ALTER TABLE "project_categories" ADD COLUMN "order_old" INTEGER DEFAULT 0`);
        await queryRunner.query(`
      UPDATE "project_categories" pc
      SET "order_old" = rn
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY "order") AS rn
        FROM "project_categories"
      ) ranked
      WHERE pc.id = ranked.id
    `);
        await queryRunner.query(`ALTER TABLE "project_categories" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "project_categories" RENAME COLUMN "order_old" TO "order"`);
        await queryRunner.query(`ALTER TABLE "project_categories" ALTER COLUMN "order" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_categories" ALTER COLUMN "order" SET DEFAULT 0`);
    }
}
