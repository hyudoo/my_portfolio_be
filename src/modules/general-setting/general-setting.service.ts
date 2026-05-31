import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { SettingEntity } from "../../database/entities/setting.entity";
import { updateEntity } from "../../utils/update-entity.util";
import { UpdateGeneralSettingDto } from "./dto/update-general-setting.dto";

@Injectable()
export class GeneralSettingService {
  constructor(
    @InjectRepository(SettingEntity) private readonly settingRepo: Repository<SettingEntity>,
  ) {}

  async get(locale: string) {
    let setting = await this.settingRepo.findOne({ where: { locale }, relations: ["profileImage"] });
    if (!setting) {
      setting = this.settingRepo.create({ locale });
      await this.settingRepo.save(setting);
    }
    return { setting };
  }

  @Transactional()
  async upsert(body: UpdateGeneralSettingDto) {
    let setting = await this.settingRepo.findOne({ where: { locale: body.locale } });
    if (!setting) {
      setting = this.settingRepo.create(body);
    } else {
      updateEntity(setting, body);
    }
    await this.settingRepo.save(setting);
    return { setting };
  }

  async publicGet(locale: string) {
    let setting = await this.settingRepo.findOne({ where: { locale }, relations: ["profileImage"] });
    if (!setting) {
      setting = this.settingRepo.create({ locale });
      await this.settingRepo.save(setting);
    }
    return { setting };
  }
}
