import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./_base.entity";
import { SkillEntity } from "./skill.entity";

@Entity("skill_categories")
export class SkillCategoryEntity extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  icon: string | null;

  @Column({ type: "integer", default: 0 })
  order: number;

  @OneToMany(() => SkillEntity, (skill) => skill.category)
  skills: SkillEntity[];
}
