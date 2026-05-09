import { Column, Entity } from "typeorm";
import { BaseEntity } from "./_base.entity";

@Entity("permissions")
export class PermissionEntity extends BaseEntity {
  @Column({ type: "text", unique: true })
  action: string;
}
