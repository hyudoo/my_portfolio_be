import { PartialType } from "@nestjs/swagger";
import { CreateRoleBody } from "./create-role-body.dto";

export class UpdateRoleBody extends PartialType(CreateRoleBody) {}
