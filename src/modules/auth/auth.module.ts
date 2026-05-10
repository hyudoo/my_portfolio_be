import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JWT_EXPIRATION, JWT_SECRET_KEY } from "../../constants/env-key.constant";
import { entities } from "../../database";
import { MailModule } from "../mail/mail.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AppGuard } from "./guards/app.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { REDIS_CLIENT } from "../../constants/auth.constants";
import { redisClient } from "../../redis/redis.config";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get(JWT_SECRET_KEY)!;
        const expiresIn = configService.get(JWT_EXPIRATION)!;
        return {
          secret: secret,
          signOptions: { expiresIn },
        };
      },
    }),
    TypeOrmModule.forFeature(entities),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
    {
      provide: REDIS_CLIENT,
      useValue: redisClient,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
