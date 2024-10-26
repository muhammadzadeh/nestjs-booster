import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaginationDto } from '@repo/types/pagination.dto';
import { NotificationOrderBy } from '../../domain/repositories/notifications.repository';

export class FilterNotificationDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(NotificationOrderBy)
  orderBy!: NotificationOrderBy;
}
