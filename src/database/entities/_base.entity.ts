import { instanceToPlain } from "class-transformer";
import { CreateDateColumn, BaseEntity as ORMBaseEntity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity extends ORMBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp", precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", precision: 3 })
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
