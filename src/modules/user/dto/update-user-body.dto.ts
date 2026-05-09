import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateUserBody } from "./create-user-body.dto";

export class UpdateUserBody extends PartialType(OmitType(CreateUserBody, ["email"])) {}
