import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSkillTable1778916885572 implements MigrationInterface {
    name = 'CreateSkillTable1778916885572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "skill_categories" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "name" character varying(100) NOT NULL,
                "icon" character varying(100),
                "order" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_efce364bf7be7b92b7d7f948663" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "skills" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "name" character varying(100) NOT NULL,
                "icon" character varying(100),
                "order" integer NOT NULL DEFAULT '0',
                "category_id" integer NOT NULL,
                CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_47dd0ade7ed449a7aca9b9e675" ON "skills" ("category_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "skills"
            ADD CONSTRAINT "FK_47dd0ade7ed449a7aca9b9e6752" FOREIGN KEY ("category_id") REFERENCES "skill_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "skills" DROP CONSTRAINT "FK_47dd0ade7ed449a7aca9b9e6752"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_47dd0ade7ed449a7aca9b9e675"
        `);
        await queryRunner.query(`
            DROP TABLE "skills"
        `);
        await queryRunner.query(`
            DROP TABLE "skill_categories"
        `);
    }

}
