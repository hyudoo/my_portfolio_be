import { Body, Controller, Get, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SkipThrottle, ThrottlerGuard } from "@nestjs/throttler";
import type { Response } from "express";
import type { IAuthUser } from "../../types/auth.type";
import { AuthService } from "./auth.service";
import { AuthUser } from "./decorators/auth-user.decorator";
import { PermitAll } from "./decorators/permit-all.decorator";
import { ForgotPasswordBody } from "./dto/forgot-password-body.dto";
import { LoginBody } from "./dto/login-body.dto";
import { RegisterBody } from "./dto/register-body.dto";
import { ResendVerifyEmailBody } from "./dto/resend-verify-email-body.dto";
import { ResetPasswordBody } from "./dto/reset-password-body.dto";
import { UpdatePasswordBody } from "./dto/update-password-body.dto";
import { VerifyEmailBody } from "./dto/verify-email-body.dto";

@UseGuards(ThrottlerGuard)
@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private service: AuthService) {}

  @Post("/login")
  @PermitAll()
  async login(@Res() res: Response, @Body() body: LoginBody) {
    const { accessToken, maxAge } = await this.service.login(body);
    res.cookie("token", accessToken, { maxAge, httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ accessToken });
  }

  @Post("/logout")
  @PermitAll()
  @SkipThrottle()
  async logout(@Res() res: Response) {
    res.cookie("token", "", { maxAge: 0, httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ success: true });
  }

  @Post("/register")
  @PermitAll()
  async register(@Body() body: RegisterBody) {
    return this.service.register(body);
  }

  @Get("/me")
  @SkipThrottle()
  async getAuthUser(@AuthUser() authUser: IAuthUser) {
    return authUser;
  }

  @Post("/forgot-password")
  @PermitAll()
  async forgotPassword(@Body() body: ForgotPasswordBody) {
    return this.service.forgotPassword(body);
  }

  @Post("/verify-email")
  @PermitAll()
  async verifyEmail(@Body() body: VerifyEmailBody) {
    return this.service.verifyEmail(body);
  }

  @Post("/resend-verify-email")
  @PermitAll()
  async resendVerifyEmail(@Body() body: ResendVerifyEmailBody) {
    return this.service.resendVerifyEmail(body);
  }

  @Put("/reset-password")
  @PermitAll()
  async resetPassword(@Body() body: ResetPasswordBody) {
    return this.service.resetPassword(body);
  }

  @Put("/update-password")
  async updatePassword(@AuthUser() authUser: IAuthUser, @Body() body: UpdatePasswordBody) {
    return this.service.updatePassword(authUser, body);
  }
}
