import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHeroTitleToSetting1780418851481 implements MigrationInterface {
    name = 'AddHeroTitleToSetting1780418851481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "settings" DROP COLUMN "tagline"
        `);
        await queryRunner.query(`
            ALTER TABLE "settings"
            ADD "hero_title1" character varying(255) NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "settings"
            ADD "hero_title2" character varying(255) NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "settings"
            ADD "about_content" text NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "settings"
            ADD "profile_image_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "settings"
            ADD CONSTRAINT "FK_93c3c67d7298f06c287a5b88f64" FOREIGN KEY ("profile_image_id") REFERENCES "files"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "settings" DROP CONSTRAINT "FK_93c3c67d7298f06c287a5b88f64"
        `);
        await queryRunner.query(`
            ALTER TABLE "settings" DROP COLUMN "profile_image_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "settings" DROP COLUMN "about_content"
        `);
        await queryRunner.query(`
            ALTER TABLE "settings" DROP COLUMN "hero_title2"
        `);
        await queryRunner.query(`
            ALTER TABLE "settings" DROP COLUMN "hero_title1"
        `);
        await queryRunner.query(`
            ALTER TABLE "settings"
            ADD "tagline" character varying(255) NOT NULL DEFAULT ''
        `);
    }

}
