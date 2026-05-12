import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "./_base.entity";
import { ProjectEntity } from "./project.entity";

@Entity("project_categories")
export class ProjectCategoryEntity extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  slug: string;

  @Column({ type: "integer", default: 0 })
  order: number;

  @ManyToMany(() => ProjectEntity, (project) => project.categories)
  projects: ProjectEntity[];
}
