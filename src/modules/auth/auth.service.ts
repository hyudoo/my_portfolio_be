import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import Redis from "ioredis";
import {
  REDIS_CLIENT,
  ROLE_PERMISSIONS_CACHE_TTL,
  USER_CACHE_TTL,
  roleCacheKey,
  userCacheKey,
  userRolesCacheKey,
} from "../../constants/auth.constants";
import { InjectRepository } from "@nestjs/typeorm";
import { compare, hash } from "bcrypt";
import { In, Repository } from "typeorm";
import { JWT_SECRET_KEY } from "../../constants/env-key.constant";
import { RoleEntity } from "../../database/entities/role.entity";
import { UserEntity } from "../../database/entities/user.entity";
import { VerificationCodeEntity } from "../../database/entities/verification-code.entity";
import { LoginBody } from "./dto/login-body.dto";
import { AppException } from "../../exception/app.exception";
import { ErrorCode } from "../../exception/error-messages";
import { randomDigitsSet } from "../../utils/random-digits-set.util";
import { getResetPasswordUrl, getVerifyEmailUrl } from "../../utils/get-url.util";
import { CodeType } from "../../enums/code-type.enum";
import { datetime } from "../../utils/datetime.util";
import { MailService } from "../mail/mail.service";
import { Transactional } from "typeorm-transactional";
import { ResendVerifyEmailBody } from "./dto/resend-verify-email-body.dto";
import { RegisterBody } from "./dto/register-body.dto";
import { ForgotPasswordBody } from "./dto/forgot-password-body.dto";
import { VerifyEmailBody } from "./dto/verify-email-body.dto";
import { ResetPasswordBody } from "./dto/reset-password-body.dto";
import { IAuthUser } from "../../types/auth.type";
import { UpdatePasswordBody } from "./dto/update-password-body.dto";

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
    @InjectRepository(VerificationCodeEntity)
    private verificationCodeRepo: Repository<VerificationCodeEntity>,
    @Inject(REDIS_CLIENT)
    private redisClient: Redis,
  ) {}

  async getUserById(id: number) {
    const cacheKey = userCacheKey(id);
    const cached = await this.redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached) as UserEntity;

    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new AppException(ErrorCode.AUTH_USER_NOT_FOUND);
    if (!user.isActive) throw new AppException(ErrorCode.AUTH_USER_INACTIVE);

    await this.redisClient.setex(cacheKey, USER_CACHE_TTL, JSON.stringify(user));
    return user;
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const userRolesKey = userRolesCacheKey(userId);
    const cachedRoles = await this.redisClient.get(userRolesKey);
    let roleIds: number[];

    if (cachedRoles) {
      roleIds = JSON.parse(cachedRoles) as number[];
    } else {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: { roles: true },
      });
      if (!user) throw new AppException(ErrorCode.AUTH_USER_NOT_FOUND);
      roleIds = user.roles.map((r) => r.id);
      await this.redisClient.setex(userRolesKey, USER_CACHE_TTL, JSON.stringify(roleIds));
    }

    if (roleIds.length === 0) return [];

    const roleKeys = roleIds.map(roleCacheKey);
    const cachedPerms = await this.redisClient.mget(...roleKeys);

    const permissions = new Set<string>();
    const missingIds: number[] = [];

    cachedPerms.forEach((entry, i) => {
      if (entry) {
        (JSON.parse(entry) as string[]).forEach((p) => permissions.add(p));
      } else {
        missingIds.push(roleIds[i]);
      }
    });

    if (missingIds.length > 0) {
      const roles = await this.roleRepo.find({
        where: { id: In(missingIds) },
        relations: { permissions: true },
      });
      const pipeline = this.redisClient.pipeline();
      for (const role of roles) {
        const actions = role.permissions.map((p) => p.action);
        actions.forEach((a) => permissions.add(a));
        pipeline.setex(roleCacheKey(role.id), ROLE_PERMISSIONS_CACHE_TTL, JSON.stringify(actions));
      }
      await pipeline.exec();
    }

    return Array.from(permissions);
  }

  private async _hashPassword(password: string) {
    return hash(password, 12);
  }

  private async _comparePassword(password: string, hashed: string) {
    return compare(password, hashed);
  }

  private async _checkVerifyCode(email: string, code: string, type: CodeType) {
    const query = this.verificationCodeRepo
      .createQueryBuilder("verificationCodes")
      .innerJoin("verificationCodes.user", "user")
      .where({ code })
      .andWhere({ type })
      .andWhere("user.email = :email", { email });

    const verificationCode = await query.getOne();

    if (!verificationCode) {
      throw new AppException(ErrorCode.INVALID_CODE);
    }

    if (datetime().isAfter(datetime(verificationCode.expiresAt))) {
      throw new AppException(ErrorCode.EXPIRED_CODE);
    }
  }

  async _sendVerifyMail(user: UserEntity) {
    const { id, email, username } = user;

    const digitsCode = randomDigitsSet(6);
    const verifyEmailUrl = getVerifyEmailUrl(email, digitsCode);
    const verificationCode = this.verificationCodeRepo.create({
      code: digitsCode,
      userId: id,
      type: CodeType.VerifyEmail,
      expiresAt: datetime().add(30, "minutes"),
    });
    await this.verificationCodeRepo.save(verificationCode);

    await this.mailService.sendVerifyEmailLink(email, verifyEmailUrl, username);
  }

  async login(body: LoginBody) {
    const { email, password, remember } = body;
    const user = await this.userRepo.findOneBy({ email });
    if (!user || !(await this._comparePassword(password, user.password))) {
      throw new AppException(ErrorCode.WRONG_CREDENTIALS);
    }
    if (!user.isActive) {
      throw new AppException(ErrorCode.AUTH_USER_INACTIVE);
    }
    const accessToken = await this.jwtService.signAsync(
      { id: user.id },
      { secret: this.configService.get(JWT_SECRET_KEY) },
    );
    const maxAge = remember ? this.jwtService.decode(accessToken).exp * 1000 - Date.now() : undefined;

    return { accessToken, maxAge };
  }

  @Transactional()
  async register(body: RegisterBody) {
    const { email, password } = body;

    const existing = await this.userRepo.findOne({ where: { email }, withDeleted: true });
    if (existing) {
      if (!existing?.deletedAt) {
        throw new AppException(ErrorCode.USER_REGISTERED);
      } else {
        await this.userRepo.remove(existing);
      }
    }

    const defaultRole = await this.roleRepo.findOneBy({ isDefault: true });

    const user: UserEntity = this.userRepo.create({
      ...body,
      password: await this._hashPassword(password),
      isActive: false,
      ...(defaultRole ? { roles: [defaultRole] } : {}),
    });

    await this.userRepo.save(user);

    await this._sendVerifyMail(user);
  }

  @Transactional()
  async resendVerifyEmail(body: ResendVerifyEmailBody) {
    const { email } = body;

    const user = await this.userRepo.findOneOrFail({
      where: {
        email,
        isActive: false,
      },
    });

    await this.verificationCodeRepo.delete({
      userId: user.id,
      type: CodeType.VerifyEmail,
    });

    await this._sendVerifyMail(user);
  }

  @Transactional()
  async forgotPassword(body: ForgotPasswordBody) {
    const { email } = body;
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppException(ErrorCode.EMAIL_NOT_FOUND);
    }

    await this.verificationCodeRepo.delete({
      userId: user.id,
      type: CodeType.ResetPassword,
    });

    const digitsCode = randomDigitsSet(6);
    const verificationCode = this.verificationCodeRepo.create({
      code: digitsCode,
      userId: user.id,
      type: CodeType.ResetPassword,
      expiresAt: datetime().add(30, "minutes"),
    });

    await this.verificationCodeRepo.save(verificationCode);
    const resetPasswordUrl = getResetPasswordUrl(email, digitsCode);

    await this.mailService.sendResetPasswordEmail(email, resetPasswordUrl, user.username);
  }

  @Transactional()
  async verifyEmail(body: VerifyEmailBody) {
    const { email, code } = body;
    await this._checkVerifyCode(email, code, CodeType.VerifyEmail);

    const queryBuilder = this.userRepo
      .createQueryBuilder("users")
      .innerJoin("users.verificationCodes", "verificationCodes")
      .where({ email })
      .andWhere("verificationCodes.type = :type", { type: CodeType.VerifyEmail })
      .andWhere("verificationCodes.code = :code", { code });

    const user = await queryBuilder.getOne();

    if (!user) {
      throw new AppException(ErrorCode.INVALID_CODE);
    }

    user.isActive = true;
    await this.userRepo.save(user);
    await this.redisClient.del(userCacheKey(user.id));

    await this.verificationCodeRepo.delete({
      code,
      userId: user.id,
      type: CodeType.VerifyEmail,
    });
  }

  @Transactional()
  async resetPassword(body: ResetPasswordBody) {
    const { email, code, password } = body;

    await this._checkVerifyCode(email, code, CodeType.ResetPassword);

    const queryBuilder = this.userRepo
      .createQueryBuilder("users")
      .innerJoin("users.verificationCodes", "verificationCodes")
      .where({ email })
      .andWhere("verificationCodes.type = :type", { type: CodeType.ResetPassword })
      .andWhere("verificationCodes.code = :code", { code });

    const user = await queryBuilder.getOne();

    if (!user) {
      throw new AppException(ErrorCode.INVALID_CODE);
    }

    user.password = await this._hashPassword(password);
    await this.userRepo.save(user);
    await this.redisClient.del(userCacheKey(user.id));

    await this.verificationCodeRepo.delete({
      code,
      userId: user.id,
      type: CodeType.ResetPassword,
    });
  }

  @Transactional()
  async updatePassword(authUser: IAuthUser, body: UpdatePasswordBody) {
    const { password, newPassword } = body;

    if (!(await this._comparePassword(password, authUser.password))) {
      throw new AppException(ErrorCode.WRONG_OLD_PASSWORD);
    }

    authUser.password = await this._hashPassword(newPassword);
    await this.userRepo.save(authUser);
    await this.redisClient.del(userCacheKey(authUser.id));
  }
}
