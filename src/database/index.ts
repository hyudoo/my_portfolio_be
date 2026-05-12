import { FileEntity } from "./entities/file.entity";
import { PermissionEntity } from "./entities/permission.entity";
import { ProjectCategoryEntity } from "./entities/project-category.entity";
import { ProjectEntity } from "./entities/project.entity";
import { RoleEntity } from "./entities/role.entity";
import { SkillCategoryEntity } from "./entities/skill-category.entity";
import { SkillEntity } from "./entities/skill.entity";
import { UserEntity } from "./entities/user.entity";
import { VerificationCodeEntity } from "./entities/verification-code.entity";

export const entities = [
  UserEntity,
  RoleEntity,
  PermissionEntity,
  VerificationCodeEntity,
  SkillCategoryEntity,
  SkillEntity,
  FileEntity,
  ProjectCategoryEntity,
  ProjectEntity,
];
