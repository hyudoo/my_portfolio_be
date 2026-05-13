import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "./_base.entity";

@Entity("subscribers")
export class SubscriberEntity extends BaseEntity {
  @Index("IDX_subscribers_email", { unique: true })
  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ name: "confirmed_at", type: "timestamp", precision: 3, nullable: true })
  confirmedAt: Date | null;
}
