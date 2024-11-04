import { Entity, PrimaryColumn } from 'typeorm';
import { UserId } from '@repo/types/common.types';
import { AttachmentId, AttachmentUserEntity } from '../../../domain/entities/attachment-users.entity';

@Entity({ name: 'attachment_users' })
export class TypeormAttachmentUserEntity {
  @PrimaryColumn({
    type: 'uuid',
    name: 'attachment_id',
    primaryKeyConstraintName: 'attachment_users_attachment_id_user_id_pkey',
  })
  attachmentId!: AttachmentId;

  @PrimaryColumn({
    type: 'uuid',
    name: 'user_id',
    primaryKeyConstraintName: 'attachment_users_attachment_id_user_id_pkey',
  })
  userId!: UserId;

  static toAttachmentUserEntity(item: TypeormAttachmentUserEntity): AttachmentUserEntity {
    return new AttachmentUserEntity(item.attachmentId, item.userId);
  }
}
