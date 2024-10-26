import { Paginated } from '@repo/types/database';
import { AttachmentEntity } from '../entities/attachments.entity';

export interface FindAttachmentOptions {
  ids?: string[];
  shareTokens?: string[];
  isShared?: boolean;
}

export const ATTACHMENTS_REPOSITORY_TOKEN = Symbol('AttachmentsRepository');

export interface AttachmentsRepository {
  save(data: AttachmentEntity): Promise<AttachmentEntity>;
  findOne(options: FindAttachmentOptions): Promise<AttachmentEntity | null>;
  findAll(options: FindAttachmentOptions): Promise<Paginated<AttachmentEntity>>;
  exists(options: FindAttachmentOptions): Promise<boolean>;
  delete(options: FindAttachmentOptions): Promise<void>;
  update(options: FindAttachmentOptions, data: Partial<AttachmentEntity>): Promise<void>;
}
