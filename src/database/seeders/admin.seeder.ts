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
  "user::create",
  "user::update",
  "user::delete",
  "role::read",
  "role::create",
  "role::update",
  "role::delete",
  "contact::read",
  "contact::update",
  "contact::delete",
  "skill-category::read",
  "skill-category::create",
  "skill-category::update",
  "skill-category::delete",
  "skill::read",
  "skill::create",
  "skill::update",
  "skill::delete",
  "project-category::read",
  "project-category::create",
  "project-category::update",
  "project-category::delete",
  "project::read",
  "project::create",
  "project::update",
  "project::delete",
  "subscriber::read",
  "subscriber::delete",
  "general-setting::read",
  "general-setting::update",
  "permission::read",
];

export class AdminSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const permissionRepo = connection.getRepository(PermissionEntity);
    const roleRepo = connection.getRepository(RoleEntity);
    const userRepo = connection.getRepository(UserEntity);

    const permissions = await Promise.all(
      ALL_PERMISSIONS.map(async (action) => {
        const existing = await permissionRepo.findOne({ where: { action } });
        return existing ?? (await permissionRepo.save(permissionRepo.create({ action })));
      }),
    );

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
