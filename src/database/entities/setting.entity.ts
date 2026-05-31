import { Column, Entity } from "typeorm";
import { BaseEntity } from "./_base.entity";

@Entity("settings")
export class SettingEntity extends BaseEntity {
  @Column({ type: "varchar", length: 10, unique: true, default: "vi" })
  locale: string;

  // General
  @Column({ name: "owner_name", type: "varchar", length: 255, default: "" })
  ownerName: string;

  @Column({ type: "varchar", length: 255, default: "" })
  tagline: string;

  @Column({ type: "text", default: "" })
  bio: string;

  @Column({ type: "varchar", length: 255, default: "" })
  email: string;

  @Column({ type: "varchar", length: 255, default: "" })
  location: string;

  // Social links
  @Column({ type: "varchar", length: 500, nullable: true })
  github: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  linkedin: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  twitter: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  facebook: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  instagram: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  youtube: string | null;

  @Column({ name: "resume_url", type: "varchar", length: 500, nullable: true })
  resumeUrl: string | null;

  // SEO
  @Column({ name: "seo_title", type: "varchar", length: 255, nullable: true })
  seoTitle: string | null;

  @Column({ name: "seo_description", type: "text", nullable: true })
  seoDescription: string | null;

  @Column({ name: "seo_keywords", type: "varchar", length: 500, nullable: true })
  seoKeywords: string | null;

  @Column({ name: "ga_id", type: "varchar", length: 100, nullable: true })
  gaId: string | null;

  // Appearance — which sections are visible on the frontend
  @Column({ name: "show_hero", type: "boolean", default: true })
  showHero: boolean;

  @Column({ name: "show_skills", type: "boolean", default: true })
  showSkills: boolean;

  @Column({ name: "show_projects", type: "boolean", default: true })
  showProjects: boolean;

  @Column({ name: "show_blog", type: "boolean", default: true })
  showBlog: boolean;

  @Column({ name: "show_about", type: "boolean", default: true })
  showAbout: boolean;

  @Column({ name: "show_contact", type: "boolean", default: true })
  showContact: boolean;

  // Section display order (comma-separated list of section keys)
  @Column({ name: "section_order", type: "varchar", length: 255, default: "hero,about,skills,projects,blog,contact" })
  sectionOrder: string;
}
