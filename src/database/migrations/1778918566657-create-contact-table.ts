import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContactTable1778918566657 implements MigrationInterface {
    name = 'CreateContactTable1778918566657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "type" smallint NOT NULL,
                "title" character varying(255) NOT NULL,
                "body" text NOT NULL,
                "is_read" boolean NOT NULL DEFAULT false,
                "read_at" TIMESTAMP(3),
                "metadata" jsonb,
                CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "contacts" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "name" character varying(100) NOT NULL,
                "email" character varying(255) NOT NULL,
                "subject" character varying(255) NOT NULL,
                "message" text NOT NULL,
                "status" smallint NOT NULL DEFAULT '1',
                "read_at" TIMESTAMP(3),
                CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "contacts"
        `);
        await queryRunner.query(`
            DROP TABLE "notifications"
        `);
    }

}
