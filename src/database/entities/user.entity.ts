import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./_base.entity";
import { FileEntity } from "./file.entity";
import { RoleEntity } from "./role.entity";
import { VerificationCodeEntity } from "./verification-code.entity";
import { Exclude } from "class-transformer";

@Entity("users")
export class UserEntity extends BaseEntity {
  @Column({ type: "text" })
  username: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Exclude()
  @Column({ type: "text" })
  password: string;

  @Column({ type: "boolean", name: "is_active", default: true })
  isActive: boolean;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", precision: 3, nullable: true })
  deletedAt?: Date;

  @Column({ type: "int", name: "avatar_id", nullable: true })
  avatarId?: number | null;

  @ManyToOne(() => FileEntity, { nullable: true, onDelete: "SET NULL", eager: false })
  @JoinColumn({ name: "avatar_id" })
  avatar?: FileEntity | null;

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
