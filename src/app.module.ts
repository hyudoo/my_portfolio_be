import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource, deleteDataSourceByName } from "typeorm-transactional";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { entities } from "./database";
import { options } from "./database/orm.config";
import { ExceptionModule } from "./exception/exception.module";
import { LoggerModule } from "./logger/logger.module";

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
    ExceptionModule,
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
