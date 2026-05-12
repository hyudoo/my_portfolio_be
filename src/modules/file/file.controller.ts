import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IAuthUser } from "../../types/auth.type";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListQuery } from "../../utils/dto/list-query.dto";
import { AuthUser } from "../auth/decorators/auth-user.decorator";
import { RequiredPermissions } from "../auth/decorators/required-permission.decorator";
import { GetPresignedUrlBody } from "./dto/get-presigned-url-body.dto";
import { SaveFileMetadataBody } from "./dto/save-file-metadata-body.dto";
import { FileService } from "./file.service";

@Controller("files")
@ApiTags("files")
export class FileController {
  constructor(private service: FileService) {}

  @Post("/presigned-url")
  async getPresignedUrl(@AuthUser() authUser: IAuthUser, @Body() body: GetPresignedUrlBody) {
    return this.service.getPresignedUrl(authUser, body);
  }

  @Post("/metadata")
  async saveMetadata(@AuthUser() authUser: IAuthUser, @Body() body: SaveFileMetadataBody) {
    return this.service.saveMetadata(authUser, body);
  }

  @Delete("/")
  async delete(@AuthUser() authUser: IAuthUser, @Body() body: IdsBody) {
    return this.service.delete(authUser, body);
  }
}
