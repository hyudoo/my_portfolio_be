import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFileTable1778917901114 implements MigrationInterface {
    name = 'CreateFileTable1778917901114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "files" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "name" text NOT NULL,
                "s3_key" text NOT NULL,
                "is_public" boolean NOT NULL DEFAULT false,
                "size" integer NOT NULL,
                "captured_at" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_c88a663c0f7a040fa84e3f082f5" UNIQUE ("s3_key"),
                CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_c88a663c0f7a040fa84e3f082f" ON "files" ("s3_key")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_dc5cf219906e7efe62acf919fa" ON "files" ("captured_at")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_dc5cf219906e7efe62acf919fa"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_c88a663c0f7a040fa84e3f082f"
        `);
        await queryRunner.query(`
            DROP TABLE "files"
        `);
    }

}
