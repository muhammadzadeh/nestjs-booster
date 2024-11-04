import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Paginated } from '@repo/types/database';
import { NotificationPushTokenEntity } from '../../../domain/entities/notification-push-token.entity';
import {
  FindNotificationData,
  NotificationPushTokensRepository,
} from '../../../domain/repositories/notification-push-tokens.repository';
import { TypeormNotificationPushTokenEntity } from '../entities/typeorm-notification-push-token.entity';

@Injectable()
export class TypeormNotificationPushTokensRepository implements NotificationPushTokensRepository {
  constructor(
    @InjectRepository(TypeormNotificationPushTokenEntity)
    private readonly repository: Repository<TypeormNotificationPushTokenEntity>,
  ) {}

  async save(data: NotificationPushTokenEntity): Promise<void> {
    await this.repository.save(data);
  }

  async findAll(options: Partial<FindNotificationData>): Promise<Paginated<NotificationPushTokenEntity>> {
    const queryBuilder = this.buildQuery(options);
    const result = await queryBuilder.getManyAndCount();

    return {
      items: result[0].map((item) => TypeormNotificationPushTokenEntity.toNotificationPushTokenEntity(item)),
      total: result[1],
    };
  }

  private buildQuery(options: Partial<FindNotificationData>): SelectQueryBuilder<TypeormNotificationPushTokenEntity> {
    const queryBuilder = this.repository.createQueryBuilder('token');

    if (options.userIds) {
      queryBuilder.andWhere(`token.userId IN (:...userIds)`, { userIds: options.userIds });
    }

    return queryBuilder;
  }
}
