import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MIN_PAGE_NUMBER, MIN_PAGE_SIZE } from '../../../../common/constants';
import { Paginated } from '../../../../common/database';
import { OrderDir } from '@repo/types/common.enums';
import { NotificationEntity } from '../../../domain/entities/notification.entity';
import {
  FindNotificationData,
  FindPaginatedNotificationData,
  NotificationOrderBy,
  NotificationsRepository,
} from '../../../domain/repositories/notifications.repository';
import { TypeormNotificationEntity } from '../entities/typeorm-notification.entity';

@Injectable()
export class TypeormNotificationsRepository implements NotificationsRepository {
  constructor(
    @InjectRepository(TypeormNotificationEntity)
    private readonly repository: Repository<TypeormNotificationEntity>,
  ) {}

  async save(data: NotificationEntity): Promise<NotificationEntity> {
    const item = await this.repository.save(data);
    return TypeormNotificationEntity.toNotificationEntity(item);
  }

  async update(options: Partial<FindNotificationData>, data: Partial<NotificationEntity>): Promise<void> {
    const queryBuilder = this.repository.createQueryBuilder();

    if (options.ids) {
      queryBuilder.andWhere(`id IN (:...ids)`, { ids: options.ids });
    }

    if (options.userIds) {
      queryBuilder.andWhere(`userId IN (:...userIds)`, { userIds: options.userIds });
    }

    if (options.statuses) {
      queryBuilder.andWhere(`status IN (:...statuses)`, { statuses: options.statuses });
    }

    if (options.alertStatuses) {
      queryBuilder.andWhere(`alertStatus IN (:...alertStatuses)`, { alertStatuses: options.alertStatuses });
    }

    if (options.showAsAlert) {
      queryBuilder.andWhere(`showAsAlert = :showAsAlert`, { showAsAlert: options.showAsAlert });
    }

    if (options.showInNotificationCenter) {
      queryBuilder.andWhere(`notificationCenterData IS NOT NULL`);
    }

    await queryBuilder.update(TypeormNotificationEntity).set(data).execute();
  }

  async findOne(options: Partial<FindNotificationData>): Promise<NotificationEntity | null> {
    const queryBuilder = this.buildQuery(options);
    const item = await queryBuilder.getOne();
    return item ? TypeormNotificationEntity.toNotificationEntity(item) : null;
  }

  async exists(options: Partial<FindNotificationData>): Promise<boolean> {
    const queryBuilder = this.buildQuery(options);
    return await queryBuilder.getExists();
  }

  async findAll(options: FindPaginatedNotificationData): Promise<Paginated<NotificationEntity>> {
    const {
      orderBy = NotificationOrderBy.UPDATED_AT,
      orderDir = OrderDir.DESC,
      page = MIN_PAGE_NUMBER,
      pageSize = MIN_PAGE_SIZE,
    } = options;

    const queryBuilder = this.buildQuery(options);

    const result = await queryBuilder
      .addOrderBy(`notification.${orderBy}`, orderDir)
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .getManyAndCount();

    return {
      items: result[0].map((item) => TypeormNotificationEntity.toNotificationEntity(item)),
      total: result[1],
    };
  }

  async count(options: Partial<FindNotificationData>): Promise<number> {
    const queryBuilder = this.buildQuery(options);
    return await queryBuilder.getCount();
  }

  private buildQuery(options: Partial<FindNotificationData>): SelectQueryBuilder<TypeormNotificationEntity> {
    const queryBuilder = this.repository.createQueryBuilder('notification');

    if (options.ids) {
      queryBuilder.andWhere(`notification.id IN (:...ids)`, { ids: options.ids });
    }

    if (options.userIds) {
      queryBuilder.andWhere(`notification.userId IN (:...userIds)`, { userIds: options.userIds });
    }

    if (options.statuses) {
      queryBuilder.andWhere(`notification.status IN (:...statuses)`, { statuses: options.statuses });
    }

    if (options.alertStatuses) {
      queryBuilder.andWhere(`notification.alertStatus IN (:...alertStatuses)`, {
        alertStatuses: options.alertStatuses,
      });
    }

    if (options.showAsAlert) {
      queryBuilder.andWhere(`notification.showAsAlert = :showAsAlert`, { showAsAlert: options.showAsAlert });
    }

    if (options.showInNotificationCenter) {
      queryBuilder.andWhere(`notification.notificationCenterData IS NOT NULL`);
    }
    return queryBuilder;
  }
}
