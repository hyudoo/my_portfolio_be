import { Column, Entity } from "typeorm";
import { ContactStatus } from "../../enums/contact-status.enum";
import { BaseEntity } from "./_base.entity";

@Entity("contacts")
export class ContactEntity extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255 })
  subject: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "smallint", enum: ContactStatus, default: ContactStatus.UNREAD })
  status: ContactStatus;

  @Column({ name: "read_at", type: "timestamp", precision: 3, nullable: true })
  readAt: Date | null;
}
