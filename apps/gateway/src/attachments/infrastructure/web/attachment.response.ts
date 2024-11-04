import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AttachmentId } from '../../domain/entities/attachment-users.entity';
import { AttachmentEntity, AttachmentVisibility } from '../../domain/entities/attachments.entity';
import { MimeTypeResponse } from './mime-type.response';

export class AttachmentResponse {
  static from(item: AttachmentEntity): AttachmentResponse {
    return {
      id: item.id,
      createdAt: item.createdAt,
      mimeType: item.mimeType,
      url: item.url,
      visibility: item.visibility,
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
    type: MimeTypeResponse,
    description: 'The attachment mime type',
    example: { ext: 'pdf', mime: 'application/pdf' },
  })
  @Type(() => MimeTypeResponse)
  readonly mimeType!: MimeTypeResponse | null;

  @ApiProperty({
    type: AttachmentVisibility,
    enum: AttachmentVisibility,
    enumName: 'AttachmentVisibility',
    description: 'The attachment visibility type',
  })
  @Type(() => String)
  readonly visibility!: AttachmentVisibility;

  @ApiProperty({
    type: Date,
    description: 'The attachment creation date',
  })
  @Type(() => Date)
  readonly createdAt!: Date;

  @ApiProperty({
    type: Date,
    description: 'The attachment download link',
  })
  @Type(() => String)
  readonly url!: string;
}
