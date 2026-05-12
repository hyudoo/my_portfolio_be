import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AfterInsert, AfterLoad, AfterUpdate, Column, CreateDateColumn, Entity, Index } from "typeorm";
import { AWS_S3_BUCKET } from "../../constants/env-key.constant";
import { redisClient } from "../../redis/redis.config";
import { s3Client } from "../../utils/aws-clients.util";
import { BaseEntity } from "./_base.entity";

@Entity("files")
export class FileEntity extends BaseEntity {
  @Column({ type: "text" })
  name: string;

  @Index()
  @Column({ type: "text", name: "s3_key", unique: true })
  s3Key: string;

  @Column({ type: "boolean", name: "is_public", default: false })
  isPublic: boolean;

  @Column({ type: "int" })
  size: number;

  @Index()
  @CreateDateColumn({ type: "timestamptz", name: "captured_at", precision: 3 })
  capturedAt: Date;

  url: string;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async generateUrl() {
    if (this.isPublic) {
      this.url = `https://${process.env[AWS_S3_BUCKET]}.s3.amazonaws.com/${this.s3Key}`;
    } else {
      const redisKey = `s3:url:${this.s3Key}`;
      const cachedUrl = await redisClient.get(redisKey);
      if (cachedUrl) {
        this.url = cachedUrl;
      } else {
        this.url = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env[AWS_S3_BUCKET],
            Key: this.s3Key,
            ResponseContentDisposition: "attachment",
          }),
          {
            expiresIn: 86_400,
          },
        );
        await redisClient.set(redisKey, this.url, "EX", 3600);
      }
    }
  }
}
