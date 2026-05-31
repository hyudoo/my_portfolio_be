import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./_base.entity";
import { SkillCategoryEntity } from "./skill-category.entity";

@Entity("skills")
@Index(["categoryId", "order"])
export class SkillEntity extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  icon: string | null;

  @Column({ type: "varchar", length: 10, default: "vi" })
  locale: string;

  @Column({ type: "text", default: "a0" })
  order: string;

  @Column({ type: "integer", name: "category_id" })
  categoryId: number;

  @ManyToOne(() => SkillCategoryEntity, (category) => category.skills, { onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category: SkillCategoryEntity;
}
