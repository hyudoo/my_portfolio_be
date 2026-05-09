import { hashSync } from "bcrypt";
import { config } from "dotenv";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { UserEntity } from "../entities/user.entity";

config();
export class AdminSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const userRepo = connection.getRepository(UserEntity);

    const password = hashSync(process.env.ADMIN_PASSWORD!, 12);

    const admin = userRepo.create({
      email: "admin@gmail.com",
      username: "admin",
      password,
      isActive: true,
    });
    await userRepo.save(admin);
  }
}
