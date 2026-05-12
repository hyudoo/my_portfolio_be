import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource, deleteDataSourceByName } from "typeorm-transactional";
import { entities } from "./database";
import { options } from "./database/orm.config";
import { ExceptionModule } from "./exception/exception.module";
import { LoggerModule } from "./logger/logger.module";
import { AuthModule } from "./modules/auth/auth.module";
import { RoleModule } from "./modules/role/role.module";
import { PublicModule } from "./modules/public/public.module";
import { SkillCategoryModule } from "./modules/skill-category/skill-category.module";
import { UserModule } from "./modules/user/user.module";
import { redisOptions } from "./redis/redis.config";
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, envFilePath: ".env" }),
    LoggerModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return options;
      },
      async dataSourceFactory(options) {
        deleteDataSourceByName("default");
        return addTransactionalDataSource(new DataSource(options!));
      },
    }),
    BullModule.forRoot(redisOptions),
    ExceptionModule,
    TypeOrmModule.forFeature(entities),
    AuthModule,
    UserModule,
    RoleModule,
    SkillCategoryModule,
    PublicModule,
    FileModule,
  ],
})
export class AppModule {}
