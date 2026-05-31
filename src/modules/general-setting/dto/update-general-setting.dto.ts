import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsString, Length } from "class-validator";
import { ToStringOrNull } from "../../../utils/decorators/to-string-or-null.decorator";
import { Trim } from "../../../utils/decorators/trim.decorator";

export class UpdateGeneralSettingDto {
  @ApiProperty({ type: "string" })
  @Trim()
  @IsString()
  @Length(2, 10)
  locale: string;

  // General
  @ApiPropertyOptional({ type: "string" })
  @IsOptional()
  @Trim()
  @IsString()
  @Length(0, 255)
  ownerName?: string;

  @ApiPropertyOptional({ type: "string" })
  @IsOptional()
  @Trim()
  @IsString()
  @Length(0, 255)
  heroTitle1?: string;

  @ApiPropertyOptional({ type: "string" })
  @IsOptional()
  @Trim()
  @IsString()
  @Length(0, 255)
  heroTitle2?: string;

  @ApiPropertyOptional({ type: "string" })
  @IsOptional()
  @Trim()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ type: "string" })
  @IsOptional()
  @IsString()
  aboutContent?: string;

  @ApiPropertyOptional({ type: "string" })
  @IsOptional()
  @Trim()
  @IsString()
  @Length(0, 255)
  email?: string;

  @ApiPropertyOptional({ type: "string" })
  @IsOptional()
  @Trim()
  @IsString()
  @Length(0, 255)
  location?: string;

  // Social
  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  @Length(0, 500)
  github?: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  @Length(0, 500)
  linkedin?: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  @Length(0, 500)
  twitter?: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  @Length(0, 500)
  facebook?: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  @Length(0, 500)
  instagram?: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  @Length(0, 500)
  youtube?: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  @Length(0, 500)
  resumeUrl?: string | null;

  // SEO
  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  @Length(0, 255)
  seoTitle?: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  seoDescription?: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  @Length(0, 500)
  seoKeywords?: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @ToStringOrNull()
  @IsString()
  @Length(0, 100)
  gaId?: string | null;

  // Appearance
  @ApiPropertyOptional({ type: "boolean" })
  @IsOptional()
  @IsBoolean()
  showHero?: boolean;

  @ApiPropertyOptional({ type: "boolean" })
  @IsOptional()
  @IsBoolean()
  showSkills?: boolean;

  @ApiPropertyOptional({ type: "boolean" })
  @IsOptional()
  @IsBoolean()
  showProjects?: boolean;

  @ApiPropertyOptional({ type: "boolean" })
  @IsOptional()
  @IsBoolean()
  showBlog?: boolean;

  @ApiPropertyOptional({ type: "boolean" })
  @IsOptional()
  @IsBoolean()
  showAbout?: boolean;

  @ApiPropertyOptional({ type: "boolean" })
  @IsOptional()
  @IsBoolean()
  showContact?: boolean;

  @ApiPropertyOptional({ type: "string" })
  @IsOptional()
  @Trim()
  @IsString()
  @Length(0, 255)
  sectionOrder?: string;

  @ApiPropertyOptional({ type: "number", nullable: true })
  @IsOptional()
  @IsInt()
  profileImageId?: number | null;
}
