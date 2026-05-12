import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as path from "path";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { FileEntity } from "../../database/entities/file.entity";
import { AppException } from "../../exception/app.exception";
import { ErrorCode } from "../../exception/error-messages";
import { IAuthUser } from "../../types/auth.type";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { AWSService } from "../3rd/aws/aws.service";
import { GetPresignedUrlBody } from "./dto/get-presigned-url-body.dto";
import { SaveFileMetadataBody } from "./dto/save-file-metadata-body.dto";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity) private fileRepo: Repository<FileEntity>,
    private awsService: AWSService,
  ) {}

  async getPresignedUrl(_authUser: IAuthUser, body: GetPresignedUrlBody) {
    const { filename, contentType, size, isPublic } = body;

    const ext = path.extname(filename);
    const prefix = isPublic ? "public" : "private";
    const s3Key = `${prefix}/${randomUUID()}${ext}`;

    const presignedUrl = await this.awsService.getPresignedUploadUrl(s3Key, contentType, size);

    return { presignedUrl, s3Key };
  }

  async saveMetadata(_authUser: IAuthUser, body: SaveFileMetadataBody) {
    const { name, s3Key, size, isPublic } = body;

    const expectedPrefix = isPublic ? "public/" : "private/";
    if (!s3Key.startsWith(expectedPrefix)) {
      throw new AppException(ErrorCode.FILE_S3_KEY_MISMATCH);
    }

    const file = this.fileRepo.create({ name, s3Key, size, isPublic });
    await this.fileRepo.save(file);

    return { file };
  }

  async list(_authUser: IAuthUser, query: ListQuery) {
    const { take, skip } = query;

    const [files, total] = await this.fileRepo.findAndCount({
      order: { capturedAt: "DESC" },
      take,
      skip,
    });

    return { files, total };
  }

  @Transactional()
  async delete(_authUser: IAuthUser, body: IdsBody) {
    const { ids } = body;

    const files = await this.fileRepo.findBy(ids.map((id) => ({ id })));

    if (files.length) {
      await Promise.all(files.map((file) => this.awsService.removeS3Object(file.s3Key)));

      await this.fileRepo.delete(ids);
    }
  }
}
