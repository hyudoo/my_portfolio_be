import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Progress, Upload } from "@aws-sdk/lib-storage";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import { PRESIGNED_URL_TTL } from "../../../constants/file.constants";
import { AWS_S3_BUCKET } from "../../../constants/env-key.constant";
import { s3Client } from "../../../utils/aws-clients.util";

@Injectable()
export class AWSService {
  constructor(private configService: ConfigService) {}

  async getPresignedUploadUrl(s3Key: string, contentType: string, size: number) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get(AWS_S3_BUCKET),
      Key: s3Key,
      ContentType: contentType,
      ContentLength: size,
    });
    return getSignedUrl(s3Client, command, { expiresIn: PRESIGNED_URL_TTL });
  }

  async removeS3Object(key: string) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get(AWS_S3_BUCKET),
        Key: key,
      }),
    );
  }
}
