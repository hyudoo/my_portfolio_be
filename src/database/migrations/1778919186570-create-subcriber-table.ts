import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubcriberTable1778919186570 implements MigrationInterface {
    name = "CreateSubcriberTable1778919186570";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "subscribers" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
                "email" character varying(255) NOT NULL,
                "confirmed_at" TIMESTAMP(3),
                CONSTRAINT "PK_cbe0a7a9256c826f403c0236b67" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_subscribers_email" ON "subscribers" ("email")
        `);
        await queryRunner.query(`
            ALTER TABLE "verification_codes"
            ADD "subscriber_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "verification_codes" DROP CONSTRAINT "FK_0a53c41a810420ee446082ce6c6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b0b1a8fe3a004b5020e1c9d5c7"
        `);
        await queryRunner.query(`
            ALTER TABLE "verification_codes"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b0b1a8fe3a004b5020e1c9d5c7" ON "verification_codes" ("user_id", "code", "type")
        `);
        await queryRunner.query(`
            ALTER TABLE "verification_codes"
            ADD CONSTRAINT "FK_0a53c41a810420ee446082ce6c6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "verification_codes"
            ADD CONSTRAINT "FK_de386aa90b6a2a45da5278a0aa4" FOREIGN KEY ("subscriber_id") REFERENCES "subscribers"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "verification_codes" DROP CONSTRAINT "FK_de386aa90b6a2a45da5278a0aa4"
        `);
        await queryRunner.query(`
            ALTER TABLE "verification_codes" DROP CONSTRAINT "FK_0a53c41a810420ee446082ce6c6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b0b1a8fe3a004b5020e1c9d5c7"
        `);
        await queryRunner.query(`
            ALTER TABLE "verification_codes"
            ALTER COLUMN "user_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b0b1a8fe3a004b5020e1c9d5c7" ON "verification_codes" ("code", "type", "user_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "verification_codes"
            ADD CONSTRAINT "FK_0a53c41a810420ee446082ce6c6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "verification_codes" DROP COLUMN "subscriber_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_subscribers_email"
        `);
        await queryRunner.query(`
            DROP TABLE "subscribers"
        `);
    }
}
