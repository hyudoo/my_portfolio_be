import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { generateKeyBetween } from "fractional-indexing";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { SkillCategoryEntity } from "../../database/entities/skill-category.entity";
import { SkillEntity } from "../../database/entities/skill.entity";
import { AppLogger } from "../../logger/logger.service";

@Injectable()
export class OrderRebalanceCron {
  constructor(
    private logger: AppLogger,
    @InjectRepository(SkillCategoryEntity)
    private skillCategoryRepo: Repository<SkillCategoryEntity>,
    @InjectRepository(SkillEntity)
    private skillRepo: Repository<SkillEntity>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  async rebalance() {
    try {
      this.logger.log("Starting order rebalance...", OrderRebalanceCron.name);
      await this.rebalanceSkillCategories();
      await this.rebalanceSkills();
      this.logger.log("Order rebalance complete.", OrderRebalanceCron.name);
    } catch (error: any) {
      this.logger.error(`${error.name}\n${error.message ?? error}\n${error.stack ?? ""}`, OrderRebalanceCron.name);
    }
  }

  @Transactional()
  private async rebalanceSkillCategories() {
    const categories = await this.skillCategoryRepo.find({ order: { order: "ASC" } });
    let prev: string | null = null;
    for (const category of categories) {
      const newOrder = generateKeyBetween(prev, null);
      category.order = newOrder;
      prev = newOrder;
    }
    await this.skillCategoryRepo.save(categories);
  }

  @Transactional()
  private async rebalanceSkills() {
    const skills = await this.skillRepo.find({ order: { categoryId: "ASC", order: "ASC" } });

    const byCategory = new Map<number, SkillEntity[]>();
    for (const skill of skills) {
      const group = byCategory.get(skill.categoryId) ?? [];
      group.push(skill);
      byCategory.set(skill.categoryId, group);
    }

    const toSave: SkillEntity[] = [];
    for (const group of byCategory.values()) {
      let prev: string | null = null;
      for (const skill of group) {
        const newOrder = generateKeyBetween(prev, null);
        skill.order = newOrder;
        prev = newOrder;
        toSave.push(skill);
      }
    }
    await this.skillRepo.save(toSave);
  }
}
