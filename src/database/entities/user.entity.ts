import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "./_base.entity";
import { RoleEntity } from "./role.entity";
import { VerificationCodeEntity } from "./verification-code.entity";

@Entity("users")
export class UserEntity extends BaseEntity {
  @Column({ type: "text" })
  username: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text", select: false })
  password: string;

  @Column({ type: "boolean", name: "is_active", default: true })
  isActive: boolean;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", precision: 3, nullable: true })
  deletedAt?: Date;

  @ManyToMany(() => RoleEntity, {
    onDelete: "CASCADE",
  })
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "user_id" },
    inverseJoinColumn: { name: "role_id" },
  })
  roles: RoleEntity[];

  @OneToMany(() => VerificationCodeEntity, (code) => code.user, {
    cascade: true,
  })
  verificationCodes: VerificationCodeEntity[];
}
