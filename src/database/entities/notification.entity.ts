import { Column, Entity } from "typeorm";
import { NotificationType } from "../../enums/notification-type.enum";
import { BaseEntity } from "./_base.entity";

@Entity("notifications")
export class NotificationEntity extends BaseEntity {
  @Column({ type: "smallint", enum: NotificationType })
  type: NotificationType;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  body: string;

  @Column({ name: "is_read", type: "boolean", default: false })
  isRead: boolean;

  @Column({ name: "read_at", type: "timestamp", precision: 3, nullable: true })
  readAt: Date | null;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null;
}
