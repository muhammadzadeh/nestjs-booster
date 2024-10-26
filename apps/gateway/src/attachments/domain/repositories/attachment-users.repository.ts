import { UserId } from '@repo/types/common.types';
import { AttachmentUserEntity } from '../entities/attachment-users.entity';

export interface FindAttachmentUserOptions {
  userId?: UserId;
  attachmentId?: string;
}

export const ATTACHMENT_USERS_REPOSITORY_TOKEN = Symbol('AttachmentUsersRepository');

export interface AttachmentUsersRepository {
  save(data: AttachmentUserEntity): Promise<void>;
  exists(options: FindAttachmentUserOptions): Promise<boolean>;
  delete(options: FindAttachmentUserOptions): Promise<void>;
}
