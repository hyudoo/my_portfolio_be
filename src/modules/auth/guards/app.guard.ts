import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { IS_REQUIRED_PERMISSIONS } from "../decorators/required-permission.decorator";
import { IS_PERMIT_ALL } from "../decorators/permit-all.decorator";

@Injectable()
export class AppGuard extends AuthGuard("jwt") {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPermitAll = this.reflector.getAllAndOverride<boolean>(IS_PERMIT_ALL, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPermitAll) {
      return true;
    }

    const isAuthenticated = (await super.canActivate(context)) as boolean;

    if (!isAuthenticated) return false;

    const userContext = context.switchToHttp().getRequest().user;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(IS_REQUIRED_PERMISSIONS, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions = await this.authService.getUserPermissions(userContext.id);
      const hasPermission = requiredPermissions.some((permission) => userPermissions.includes(permission));
      if (!hasPermission) {
        return false;
      }
    }

    return true;
  }
}
