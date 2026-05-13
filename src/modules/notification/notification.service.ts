import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { NotificationEntity } from "../../database/entities/notification.entity";
import { AppException } from "../../exception/app.exception";
import { ErrorCode } from "../../exception/error-messages";
import { IAuthUser } from "../../types/auth.type";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { ListNotificationQuery } from "./dto/list-notification.dto";

@Injectable()
export class NotificationService {
  constructor(@InjectRepository(NotificationEntity) private notificationRepo: Repository<NotificationEntity>) {}

  async list(authUser: IAuthUser, query: ListNotificationQuery) {
    const { take, skip, isRead } = query;

    const qb = this.notificationRepo
      .createQueryBuilder("notification")
      .addOrderBy("notification.createdAt", "DESC")
      .take(take)
      .skip(skip);

    if (isRead !== undefined) {
      qb.andWhere("notification.isRead = :isRead", { isRead });
    }

    const [notifications, total] = await qb.getManyAndCount();
    return { notifications, total };
  }

  async unreadCount() {
    const count = await this.notificationRepo.count({ where: { isRead: false } });
    return { count };
  }

  @Transactional()
  async markRead(authUser: IAuthUser, id: number) {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) throw new AppException(ErrorCode.NOTIFICATION_NOT_FOUND);

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      await this.notificationRepo.save(notification);
    }
  }

  @Transactional()
  async markAllRead(authUser: IAuthUser) {
    await this.notificationRepo
      .createQueryBuilder()
      .update(NotificationEntity)
      .set({ isRead: true, readAt: () => "NOW()" })
      .where("is_read = false")
      .execute();
  }

  @Transactional()
  async delete(authUser: IAuthUser, body: IdsBody) {
    await this.notificationRepo.delete(body.ids);
  }
}
