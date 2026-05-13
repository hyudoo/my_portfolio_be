import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { ContactEntity } from "../../database/entities/contact.entity";
import { NotificationEntity } from "../../database/entities/notification.entity";
import { AppException } from "../../exception/app.exception";
import { ErrorCode } from "../../exception/error-messages";
import { IAuthUser } from "../../types/auth.type";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { MailService } from "../mail/mail.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { ListContactQuery } from "./dto/list-contact.dto";
import { UpdateContactStatusDto } from "./dto/update-contact-status.dto";
import { toSearchString } from "../../utils/to-search-string.util";
import { ContactStatus } from "../../enums/contact-status.enum";
import { NotificationType } from "../../enums/notification-type.enum";

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity) private contactRepo: Repository<ContactEntity>,
    @InjectRepository(NotificationEntity) private notificationRepo: Repository<NotificationEntity>,
    private mailService: MailService,
  ) {}

  @Transactional()
  async submitPublic(body: CreateContactDto) {
    const contact = this.contactRepo.create({ ...body, status: ContactStatus.UNREAD });
    await this.contactRepo.save(contact);

    const notification = this.notificationRepo.create({
      type: NotificationType.CONTACT_SUBMISSION,
      title: `New contact from ${body.name}`,
      body: body.subject,
      isRead: false,
      readAt: null,
      metadata: { contactId: contact.id, senderEmail: body.email },
    });
    await this.notificationRepo.save(notification);

    // fire-and-forget — email is queued asynchronously
    void this.mailService.sendContactNotification(body.name, body.email, body.subject, body.message);
  }

  async list(authUser: IAuthUser, query: ListContactQuery) {
    const { keyword, take, skip, status } = query;

    const qb = this.contactRepo
      .createQueryBuilder("contact")
      .addOrderBy("contact.createdAt", "DESC")
      .take(take)
      .skip(skip);

    if (keyword) {
      qb.andWhere("(contact.name ILIKE :search OR contact.email ILIKE :search OR contact.subject ILIKE :search)", {
        search: toSearchString(keyword),
      });
    }

    if (status) {
      qb.andWhere("contact.status = :status", { status });
    }

    const [contacts, total] = await qb.getManyAndCount();
    return { contacts, total };
  }

  async detail(authUser: IAuthUser, id: number) {
    const contact = await this.contactRepo.findOne({ where: { id } });
    if (!contact) throw new AppException(ErrorCode.CONTACT_NOT_FOUND);

    if (contact.status === ContactStatus.UNREAD) {
      contact.status = ContactStatus.READ;
      contact.readAt = new Date();
      await this.contactRepo.save(contact);
    }

    return { contact };
  }

  @Transactional()
  async updateStatus(authUser: IAuthUser, id: number, body: UpdateContactStatusDto) {
    const contact = await this.contactRepo.findOne({ where: { id } });
    if (!contact) throw new AppException(ErrorCode.CONTACT_NOT_FOUND);

    contact.status = body.status;
    if (body.status === ContactStatus.READ && !contact.readAt) {
      contact.readAt = new Date();
    }
    await this.contactRepo.save(contact);
  }

  @Transactional()
  async delete(authUser: IAuthUser, body: IdsBody) {
    await this.contactRepo.delete(body.ids);
  }

  async unreadCount() {
    return this.contactRepo.count({ where: { status: ContactStatus.UNREAD } });
  }
}
