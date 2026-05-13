import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { CodeType } from "../../enums/code-type.enum";
import { VerificationCodeEntity } from "../../database/entities/verification-code.entity";
import { SubscriberEntity } from "../../database/entities/subscriber.entity";
import { AppException } from "../../exception/app.exception";
import { ErrorCode } from "../../exception/error-messages";
import { IdsBody } from "../../utils/dto/ids-body.dto";
import { toSearchString } from "../../utils/to-search-string.util";
import { datetime } from "../../utils/datetime.util";
import { getSubscribeConfirmUrl, getUnsubscribeUrl } from "../../utils/get-url.util";
import { MailService } from "../mail/mail.service";
import { ListSubscriberQuery } from "./dto/list-subscriber.dto";
import { SubscribeDto } from "./dto/subscribe.dto";

@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(SubscriberEntity) private readonly subscriberRepo: Repository<SubscriberEntity>,
    @InjectRepository(VerificationCodeEntity) private readonly verificationCodeRepo: Repository<VerificationCodeEntity>,
    private readonly mailService: MailService,
  ) {}

  @Transactional()
  async subscribe(body: SubscribeDto): Promise<{ message: string }> {
    const { email } = body;
    const existing = await this.subscriberRepo.findOne({ where: { email } });

    if (existing) {
      if (existing.confirmedAt !== null) {
        throw new AppException(ErrorCode.SUBSCRIBER_EMAIL_ALREADY_EXISTS, 409);
      }
      // Unconfirmed — delete old code, issue a new one and resend
      await this.verificationCodeRepo.delete({
        subscriberId: existing.id,
        type: CodeType.SubscribeConfirm,
      });
      await this._sendConfirmationEmail(email, existing.id);
      return { message: "Confirmation email sent" };
    }

    const subscriber = this.subscriberRepo.create({ email, confirmedAt: null });
    await this.subscriberRepo.save(subscriber);
    await this._sendConfirmationEmail(email, subscriber.id);
    return { message: "Confirmation email sent" };
  }

  private async _sendConfirmationEmail(email: string, subscriberId: number) {
    const code = randomUUID();
    const verificationCode = this.verificationCodeRepo.create({
      code,
      type: CodeType.SubscribeConfirm,
      subscriberId,
      userId: null,
      expiresAt: datetime().add(24, "hours").toDate(),
    });
    await this.verificationCodeRepo.save(verificationCode);

    void this.mailService.sendSubscribeConfirmation(
      email,
      getSubscribeConfirmUrl(code),
      getUnsubscribeUrl(code),
    );
  }

  @Transactional()
  async confirm(token: string): Promise<{ message: string }> {
    const code = await this.verificationCodeRepo.findOne({
      where: { code: token, type: CodeType.SubscribeConfirm },
    });
    if (!code) throw new AppException(ErrorCode.SUBSCRIBER_INVALID_TOKEN);

    const subscriber = await this.subscriberRepo.findOne({ where: { id: code.subscriberId! } });
    if (!subscriber) throw new AppException(ErrorCode.SUBSCRIBER_NOT_FOUND);
    if (subscriber.confirmedAt !== null) throw new AppException(ErrorCode.SUBSCRIBER_ALREADY_CONFIRMED);

    if (datetime().isAfter(datetime(code.expiresAt))) {
      throw new AppException(ErrorCode.SUBSCRIBER_INVALID_TOKEN);
    }

    subscriber.confirmedAt = new Date();
    await this.subscriberRepo.save(subscriber);
    // Keep the code alive so the unsubscribe link in the email continues to work
    return { message: "Subscription confirmed" };
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    const code = await this.verificationCodeRepo.findOne({
      where: { code: token, type: CodeType.SubscribeConfirm },
    });
    if (!code) throw new AppException(ErrorCode.SUBSCRIBER_INVALID_TOKEN);

    // Deleting the subscriber cascades and removes the verification code too
    await this.subscriberRepo.delete(code.subscriberId!);
    return { message: "Unsubscribed successfully" };
  }

  async list(query: ListSubscriberQuery) {
    const { keyword, take, skip, confirmed } = query;

    const qb = this.subscriberRepo
      .createQueryBuilder("subscriber")
      .orderBy("subscriber.createdAt", "DESC")
      .take(take)
      .skip(skip);

    if (keyword) {
      qb.andWhere("subscriber.email ILIKE :search", { search: toSearchString(keyword) });
    }

    if (confirmed === true) {
      qb.andWhere("subscriber.confirmedAt IS NOT NULL");
    } else if (confirmed === false) {
      qb.andWhere("subscriber.confirmedAt IS NULL");
    }

    const [subscribers, total] = await qb.getManyAndCount();
    return { subscribers, total };
  }

  @Transactional()
  async delete(body: IdsBody) {
    const subscribers = await this.subscriberRepo.findBy({ id: In(body.ids) });
    await this.subscriberRepo.delete(body.ids);
    return { subscribers };
  }
}
