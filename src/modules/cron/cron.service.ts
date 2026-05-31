import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, LessThanOrEqual, Repository } from "typeorm";
import { FileEntity } from "../../database/entities/file.entity";
import { UserEntity } from "../../database/entities/user.entity";
import { VerificationCodeEntity } from "../../database/entities/verification-code.entity";
import { AppLogger } from "../../logger/logger.service";
import { datetime } from "../../utils/datetime.util";
import { FileService } from "../file/file.service";

@Injectable()
export class CronService {
  constructor(
    private logger: AppLogger,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(VerificationCodeEntity)
    private codeRepo: Repository<VerificationCodeEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    @InjectRepository(FileEntity)
    private fileRepo: Repository<FileEntity>,
    private fileService: FileService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDelete() {
    try {
      const codes = await this.codeRepo.find({
        where: {
          expiresAt: LessThanOrEqual(datetime().toDate()),
        },
      });
      await codes.forEachAsync(async (code) => {
        await this.codeRepo.delete(code.id);
      });

      const users = await this.userRepo.find({
        where: {
          deletedAt: LessThanOrEqual(datetime().subtract(15, "days").toDate()),
        },
        withDeleted: true,
      });

      await this.userRepo.delete(users.map((user) => user.id));
      const tables = await this.entityManager.query(`select
        c.conname as contraint_name,
        c.conrelid::regclass::text as referencing_table,
        kcu.column_name as foreign_key_column
      from
        pg_constraint c
      join
          pg_attribute a on
        a.attnum = any(c.conkey)
        and a.attrelid = c.conrelid
      join
        information_schema.key_column_usage kcu
        on
        kcu.table_name = c.conrelid::regclass::text and kcu.constraint_name = c.conname
      join
          information_schema.table_constraints tc
          on
        tc.constraint_type = 'FOREIGN KEY' and tc.constraint_name = c.conname
      where
        c.confrelid = 'files'::regclass::oid
      and c.contype = 'f'`);

      const queryBuilder = await this.fileRepo
        .createQueryBuilder("file")
        .andWhere("file.createdAt <= :createdAt", { createdAt: datetime().subtract(1, "days").toDate() });
      for (const { referencing_table, foreign_key_column } of tables) {
        queryBuilder.andWhere(
          `(NOT EXISTS (SELECT 1 FROM "${referencing_table}" WHERE "${foreign_key_column}" = file.id))`,
        );
      }
      const files = await queryBuilder.getMany();

      await files.forEachAsync(async (file) => {
        await this.fileService._delete(file);
      });
    } catch (error: any) {
      this.logger.error(`${error.name}\n${error.message ?? error}\n${error.stack ?? ""}`, "Cronjob delete");
    }
  }
}
