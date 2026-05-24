import { hashSync } from "bcrypt";
import { config } from "dotenv";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { UserEntity } from "../entities/user.entity";
import { RoleEntity } from "../entities/role.entity";
import { PermissionEntity } from "../entities/permission.entity";

config();
export class UserSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const userRepo = connection.getRepository(UserEntity);
    const roleRepo = connection.getRepository(RoleEntity);
    const permissionRepo = connection.getRepository(PermissionEntity);

    const password = hashSync(process.env.ADMIN_PASSWORD!, 12);

    const permissionActions = ["user::read", "user::write"];
    const permissions = await Promise.all(
      permissionActions.map(async (action) => {
        const existing = await permissionRepo.findOne({ where: { action } });
        return existing ?? (await permissionRepo.save(permissionRepo.create({ action })));
      }),
    );

    const role = roleRepo.create({
      name: "user",
      permissions,
    });
    await roleRepo.save(role);

    const user = userRepo.create({
      email: "user1@gmail.com",
      username: "user1",
      password,
      isActive: true,
      roles: [role],
    });
    await userRepo.save(user);
  }
}
