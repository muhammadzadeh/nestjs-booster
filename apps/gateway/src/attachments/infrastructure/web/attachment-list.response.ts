import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ListResponse } from '@repo/types/serialization';
import { AttachmentEntity } from '../../domain/entities/attachments.entity';
import { AttachmentResponse } from './attachment.response';

export class AttachmentListResponse extends ListResponse<AttachmentResponse> {
  static from(items: AttachmentEntity[]): AttachmentListResponse {
    return new AttachmentListResponse(
      items.map((item) => AttachmentResponse.from(item)),
      {
        total: items.length,
      },
    );
  }

  @ApiProperty({
    type: AttachmentResponse,
    isArray: true,
    description: 'The Attachments',
  })
  @Type(() => AttachmentResponse)
  declare items: AttachmentResponse[];
}
