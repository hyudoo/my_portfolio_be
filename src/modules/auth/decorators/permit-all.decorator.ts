import { SetMetadata } from "@nestjs/common";

export const IS_PERMIT_ALL = "isPermitAll";

export const PermitAll = () => SetMetadata(IS_PERMIT_ALL, true);
