import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { UserId } from '@repo/types/common.types';
import { AttachmentId } from '../../../domain/entities/attachment-users.entity';
import { AttachmentEntity, AttachmentVisibility, MimeType } from '../../../domain/entities/attachments.entity';

@Entity({ name: 'attachments' })
export class TypeormAttachmentEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'attachments_id_pkey' })
  readonly id!: AttachmentId;

  @Column({ type: 'varchar', name: 'path' })
  readonly path!: string;

  @Column({ type: 'varchar', name: 'name' })
  readonly name!: string;

  @Column({ type: 'varchar', nullable: true, name: 'original_name' })
  readonly originalName!: string | null;

  @Column({ type: 'enum', enum: AttachmentVisibility, name: 'visibility' })
  readonly visibility!: AttachmentVisibility;

  @Column({ type: 'jsonb', nullable: true, name: 'mime_type' })
  readonly mimeType!: MimeType | null;

  @Column({ type: 'uuid', name: 'uploader_id' })
  @Index('attachments_uploader_id_idx')
  readonly uploaderId!: UserId;

  @Column({ type: 'boolean', name: 'is_draft' })
  readonly isDraft!: boolean;

  @Column({ type: 'boolean', name: 'is_shared' })
  readonly isShared!: boolean;

  @Column({ type: 'varchar', nullable: true, name: 'share_token' })
  @Index('attachments_uploader_share_token_idx')
  readonly shareToken!: string | null;

  @Column({ type: 'timestamptz', name: 'created_at', default: 'now()' })
  readonly createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: 'now()' })
  readonly updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  static toAttachmentEntity(item: TypeormAttachmentEntity, baseUrl: string): AttachmentEntity {
    return new AttachmentEntity(
      item.originalName,
      item.visibility,
      item.mimeType,
      item.uploaderId,
      item.isDraft,
      item.path,
      item.name,
      item.isShared,
      item.shareToken,
      item.id,
      item.deletedAt,
      item.createdAt,
      item.updatedAt,
      baseUrl
    );
  }
}
