import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { REDIS_CLIENT } from "../../constants/auth.constants";
import { entities } from "../../database";
import { redisClient } from "../../redis/redis.config";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: REDIS_CLIENT,
      useValue: redisClient,
    },
  ],
})
export class RoleModule {}
