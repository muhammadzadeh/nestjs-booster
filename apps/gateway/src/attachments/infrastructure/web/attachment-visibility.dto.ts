import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AttachmentVisibility } from '../../domain/entities/attachments.entity';

export class AttachmentVisibilityDto {
  @ApiProperty({
    type: AttachmentVisibility,
    enum: AttachmentVisibility,
    enumName: 'AttachmentVisibility',
    description: 'the attachment visibility type',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AttachmentVisibility)
  visibility!: AttachmentVisibility;
}
