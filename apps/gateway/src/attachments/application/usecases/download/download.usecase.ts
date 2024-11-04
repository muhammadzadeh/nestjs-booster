import { Inject, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { AttachmentEntity, AttachmentNotFoundException } from '../../../domain/entities/attachments.entity';
import {
  ATTACHMENT_USERS_REPOSITORY_TOKEN,
  AttachmentUsersRepository,
} from '../../../domain/repositories/attachment-users.repository';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import { STORAGE_PROVIDER_TOKEN, StorageProvider } from '../../storage-provider';
import { DownloadCommand } from './download.command';

@Injectable()
export class DownloadUsecase {
  constructor(
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: StorageProvider,
    @Inject(ATTACHMENT_USERS_REPOSITORY_TOKEN)
    private readonly attachmentUsersRepository: AttachmentUsersRepository,
  ) {}

  async execute(command: DownloadCommand): Promise<DownloadAttachmentResult> {
    const attachmentRecord = await this.findAttachmentOrFail(command);

    if (command.userId) {
      const canAccessAttachment = await this.canAccessAttachment(attachmentRecord, command.userId);

      if (!canAccessAttachment) {
        throw new AttachmentNotFoundException(
          `User ${command.userId} can not access attachment ${attachmentRecord.id}`,
        );
      }
    }

    const bufferedAttachment = await this.storageProvider.download(attachmentRecord.getPathAndName());
    return {
      attachment: attachmentRecord,
      buffer: bufferedAttachment,
    };
  }

  private async findAttachmentOrFail(command: DownloadCommand): Promise<AttachmentEntity> {
    const item = await this.attachmentsRepository.findOne({
      ids: isUUID(command.id) ? [command.id] : undefined,
      shareTokens: !isUUID(command.id) ? [command.id] : undefined,
      isShared: command.isShared,
    });

    if (!item) {
      throw new AttachmentNotFoundException(`Attachment not found with id ${command.id}`);
    }
    return item;
  }

  private async canAccessAttachment(attachmentRecord: AttachmentEntity, userId: string): Promise<boolean> {
    return (
      attachmentRecord.isPublic() ||
      attachmentRecord.uploaderId === userId ||
      (await this.attachmentUsersRepository.exists({
        attachmentId: attachmentRecord.id,
        userId: userId,
      }))
    );
  }
}

export interface DownloadAttachmentResult {
  readonly attachment: AttachmentEntity;
  readonly buffer: Buffer;
}
