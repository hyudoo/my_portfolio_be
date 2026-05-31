import { Column, Entity, Index, ManyToMany } from "typeorm";
import { BaseEntity } from "./_base.entity";
import { ProjectEntity } from "./project.entity";

@Entity("project_categories")
@Index(["order"])
export class ProjectCategoryEntity extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  slug: string;

  @Column({ type: "varchar", length: 10, default: "vi" })
  locale: string;

  @Column({ type: "text", default: "a0" })
  order: string;

  @ManyToMany(() => ProjectEntity, (project) => project.categories)
  projects: ProjectEntity[];
}
