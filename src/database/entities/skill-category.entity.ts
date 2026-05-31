import { Column, Entity, Index, OneToMany } from "typeorm";
import { BaseEntity } from "./_base.entity";
import { SkillEntity } from "./skill.entity";

@Entity("skill_categories")
@Index(["order"])
export class SkillCategoryEntity extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  icon: string | null;

  @Column({ type: "varchar", length: 10, default: "vi" })
  locale: string;

  @Column({ type: "text", default: "a0" })
  order: string;

  @OneToMany(() => SkillEntity, (skill) => skill.category)
  skills: SkillEntity[];
}
