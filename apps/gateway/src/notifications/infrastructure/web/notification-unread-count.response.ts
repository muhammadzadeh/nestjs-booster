import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class NotificationUnreadCountResponse {
  static from(count: number): NotificationUnreadCountResponse {
    return { count };
  }

  @ApiProperty({
    type: Number,
    description: 'unread count',
    example: 10,
  })
  @Type(() => Number)
  count!: number;
}
