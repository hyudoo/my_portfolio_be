import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectTable1778918018071 implements MigrationInterface {
    name = 'CreateProjectTable1778918018071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "project_categories" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "name" character varying(100) NOT NULL,
                "slug" character varying(100) NOT NULL,
                "order" integer NOT NULL DEFAULT '0',
                CONSTRAINT "UQ_46046d6693cbabd6b882cd0e5d3" UNIQUE ("slug"),
                CONSTRAINT "PK_03d7af35c2601369d030b3617bc" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "projects" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "title" character varying(255) NOT NULL,
                "description" text NOT NULL,
                "live_url" character varying(500),
                "github_url" character varying(500),
                "featured" boolean NOT NULL DEFAULT false,
                "order" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "projects_files" (
                "project_id" integer NOT NULL,
                "file_id" integer NOT NULL,
                CONSTRAINT "PK_7d9d5476399c961c8d0cbe8cac0" PRIMARY KEY ("project_id", "file_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a0c620299024c567f05d1aa80e" ON "projects_files" ("project_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b26b68c796ae6aba841c053849" ON "projects_files" ("file_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "projects_skills" (
                "project_id" integer NOT NULL,
                "skill_id" integer NOT NULL,
                CONSTRAINT "PK_24496dfdf4ca7004a2affd4f3d8" PRIMARY KEY ("project_id", "skill_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_5e7257e7cd7d211aaee71c7691" ON "projects_skills" ("project_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1935ee703881aedc750f9dbd0a" ON "projects_skills" ("skill_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "projects_categories" (
                "project_id" integer NOT NULL,
                "category_id" integer NOT NULL,
                CONSTRAINT "PK_6c943ec45ccc7b3a1eee414d1f7" PRIMARY KEY ("project_id", "category_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ff3d4df9702acb4d5a4a1d963c" ON "projects_categories" ("project_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4a0578a6a3cb1c1758d9bd5e3a" ON "projects_categories" ("category_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_files"
            ADD CONSTRAINT "FK_a0c620299024c567f05d1aa80e6" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_files"
            ADD CONSTRAINT "FK_b26b68c796ae6aba841c053849d" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_skills"
            ADD CONSTRAINT "FK_5e7257e7cd7d211aaee71c7691f" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_skills"
            ADD CONSTRAINT "FK_1935ee703881aedc750f9dbd0a0" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_categories"
            ADD CONSTRAINT "FK_ff3d4df9702acb4d5a4a1d963cb" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_categories"
            ADD CONSTRAINT "FK_4a0578a6a3cb1c1758d9bd5e3ad" FOREIGN KEY ("category_id") REFERENCES "project_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "projects_categories" DROP CONSTRAINT "FK_4a0578a6a3cb1c1758d9bd5e3ad"
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_categories" DROP CONSTRAINT "FK_ff3d4df9702acb4d5a4a1d963cb"
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_skills" DROP CONSTRAINT "FK_1935ee703881aedc750f9dbd0a0"
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_skills" DROP CONSTRAINT "FK_5e7257e7cd7d211aaee71c7691f"
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_files" DROP CONSTRAINT "FK_b26b68c796ae6aba841c053849d"
        `);
        await queryRunner.query(`
            ALTER TABLE "projects_files" DROP CONSTRAINT "FK_a0c620299024c567f05d1aa80e6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_4a0578a6a3cb1c1758d9bd5e3a"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ff3d4df9702acb4d5a4a1d963c"
        `);
        await queryRunner.query(`
            DROP TABLE "projects_categories"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_1935ee703881aedc750f9dbd0a"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_5e7257e7cd7d211aaee71c7691"
        `);
        await queryRunner.query(`
            DROP TABLE "projects_skills"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b26b68c796ae6aba841c053849"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a0c620299024c567f05d1aa80e"
        `);
        await queryRunner.query(`
            DROP TABLE "projects_files"
        `);
        await queryRunner.query(`
            DROP TABLE "projects"
        `);
        await queryRunner.query(`
            DROP TABLE "project_categories"
        `);
    }

}
