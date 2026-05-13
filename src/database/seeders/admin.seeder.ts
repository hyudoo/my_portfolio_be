import { hashSync } from "bcrypt";
import { config } from "dotenv";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { PermissionEntity } from "../entities/permission.entity";
import { RoleEntity } from "../entities/role.entity";
import { UserEntity } from "../entities/user.entity";

config();

const ALL_PERMISSIONS = [
  "user::read",
  "user::write",
  "user::update",
  "user::delete",
  "role::read",
  "role::write",
  "role::update",
  "role::delete",
  "contact::read",
  "contact::update",
  "contact::delete",
  "skill-category::read",
  "skill-category::write",
  "skill-category::update",
  "skill-category::delete",
  "skill::read",
  "skill::write",
  "skill::update",
  "skill::delete",
  "project-category::read",
  "project-category::write",
  "project-category::update",
  "project-category::delete",
  "project::read",
  "project::write",
  "project::update",
  "project::delete",
  "subscriber::read",
  "subscriber::delete",
];

export class AdminSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const permissionRepo = connection.getRepository(PermissionEntity);
    const roleRepo = connection.getRepository(RoleEntity);
    const userRepo = connection.getRepository(UserEntity);

    const permissions = permissionRepo.create(ALL_PERMISSIONS.map((action) => ({ action })));
    await permissionRepo.save(permissions);

    const adminRole = roleRepo.create({
      name: "admin",
      isDefault: false,
      permissions,
    });
    await roleRepo.save(adminRole);

    const password = hashSync(process.env.ADMIN_PASSWORD!, 12);
    const admin = userRepo.create({
      email: "admin@gmail.com",
      username: "admin",
      password,
      isActive: true,
      roles: [adminRole],
    });
    await userRepo.save(admin);
  }
}
