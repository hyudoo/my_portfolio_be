import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "./_base.entity";
import { PermissionEntity } from "./permission.entity";

@Entity("roles")
export class RoleEntity extends BaseEntity {
  @Column({ type: "text" })
  name: string;

  @ManyToMany(() => PermissionEntity, {
    cascade: true,
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id" },
    inverseJoinColumn: { name: "permission_id" },
  })
  permissions: PermissionEntity[];
}
