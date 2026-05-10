import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { entities } from "../../database";
import { TypeOrmModule } from "@nestjs/typeorm";
import { REDIS_CLIENT } from "../../constants/auth.constants";
import { redisClient } from "../../redis/redis.config";

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: REDIS_CLIENT,
      useValue: redisClient,
    },
  ],
})
export class UserModule {}
