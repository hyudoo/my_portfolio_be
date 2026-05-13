import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { CodeType } from "../../enums/code-type.enum";
import { BaseEntity } from "./_base.entity";
import { SubscriberEntity } from "./subscriber.entity";
import { UserEntity } from "./user.entity";

@Entity("verification_codes")
@Index(["userId", "code", "type"])
export class VerificationCodeEntity extends BaseEntity {
  @Column({ type: "text" })
  code: string;

  @Column({ type: "smallint", default: CodeType.ResetPassword })
  type: CodeType;

  @Column({ type: "timestamptz", name: "expires_at", precision: 3 })
  expiresAt: Date;

  @Column({ type: "int", name: "user_id", nullable: true })
  userId: number | null;

  @ManyToOne(() => UserEntity, (user) => user.verificationCodes, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity | null;

  @Column({ name: "subscriber_id", type: "int", nullable: true })
  subscriberId: number | null;

  @ManyToOne(() => SubscriberEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "subscriber_id" })
  subscriber: SubscriberEntity | null;
}
