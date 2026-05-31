import { Column, Entity, Index, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "./_base.entity";
import { FileEntity } from "./file.entity";
import { ProjectCategoryEntity } from "./project-category.entity";
import { SkillEntity } from "./skill.entity";

@Entity("projects")
@Index(["order"])
export class ProjectEntity extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "varchar", name: "live_url", length: 500, nullable: true })
  liveUrl: string | null;

  @Column({ type: "varchar", name: "github_url", length: 500, nullable: true })
  githubUrl: string | null;

  @Column({ type: "boolean", default: false })
  featured: boolean;

  @Column({ type: "varchar", length: 10, default: "vi" })
  locale: string;

  @Column({ type: "text", default: "a0" })
  order: string;

  @ManyToMany(() => FileEntity)
  @JoinTable({ name: "projects_files", joinColumn: { name: "project_id" }, inverseJoinColumn: { name: "file_id" } })
  files: FileEntity[];

  @ManyToMany(() => SkillEntity)
  @JoinTable({ name: "projects_skills", joinColumn: { name: "project_id" }, inverseJoinColumn: { name: "skill_id" } })
  skills: SkillEntity[];

  @ManyToMany(() => ProjectCategoryEntity, (category) => category.projects)
  @JoinTable({
    name: "projects_categories",
    joinColumn: { name: "project_id" },
    inverseJoinColumn: { name: "category_id" },
  })
  categories: ProjectCategoryEntity[];
}
