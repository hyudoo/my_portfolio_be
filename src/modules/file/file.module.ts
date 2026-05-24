import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "../../database/entities/file.entity";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { AWSModule } from "../3rd/aws/aws.module";

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), AWSModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule { }
