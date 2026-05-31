import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSettingTable1780153907735 implements MigrationInterface {
    name = "CreateSettingTable1780153907735";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "settings" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "owner_name" character varying(255) NOT NULL DEFAULT '',
        "tagline" character varying(255) NOT NULL DEFAULT '',
        "bio" text NOT NULL DEFAULT '',
        "email" character varying(255) NOT NULL DEFAULT '',
        "location" character varying(255) NOT NULL DEFAULT '',
        "github" character varying(500),
        "linkedin" character varying(500),
        "twitter" character varying(500),
        "facebook" character varying(500),
        "instagram" character varying(500),
        "youtube" character varying(500),
        "resume_url" character varying(500),
        "seo_title" character varying(255),
        "seo_description" text,
        "seo_keywords" character varying(500),
        "ga_id" character varying(100),
        "show_hero" boolean NOT NULL DEFAULT true,
        "show_skills" boolean NOT NULL DEFAULT true,
        "show_projects" boolean NOT NULL DEFAULT true,
        "show_blog" boolean NOT NULL DEFAULT true,
        "show_about" boolean NOT NULL DEFAULT true,
        "show_contact" boolean NOT NULL DEFAULT true,
        "section_order" character varying(255) NOT NULL DEFAULT 'hero,about,skills,projects,blog,contact',
        CONSTRAINT "PK_settings" PRIMARY KEY ("id")
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "settings"`);
    }
}
