import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AttachmentId } from '../../../../../attachments/domain/entities/attachment-users.entity';
import { AttachmentEntity } from '../../../../../attachments/domain/entities/attachments.entity';

export class AvatarResponse {
  static from(item: AttachmentEntity): AvatarResponse {
    return {
      id: item.id,
      url: item.url,
    };
  }

  @ApiProperty({
    type: String,
    description: 'The attachment ID',
    example: 'a1b2c3d4e54as4df4',
  })
  @Type(() => String)
  readonly id!: AttachmentId;

  @ApiProperty({
    type: Date,
    description: 'The attachment download link',
  })
  @Type(() => String)
  readonly url!: string;
}
