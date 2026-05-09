import { SetMetadata } from "@nestjs/common";

export const IS_REQUIRED_PERMISSIONS = "requiredPermissions";

export const RequiredPermissions = (...permissions: string[]) => SetMetadata(IS_REQUIRED_PERMISSIONS, permissions);
