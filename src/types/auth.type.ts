import { UserEntity } from "../database/entities/user.entity";

export type JwtPayload = {
  id: number;
};

export type JwtResetPasswordPayload = {
  id: number;
  updatedAt: string;
};

export type IAuthUser = UserEntity;
