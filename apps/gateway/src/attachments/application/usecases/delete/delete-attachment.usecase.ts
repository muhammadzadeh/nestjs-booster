import { Inject, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { AttachmentEntity, AttachmentNotFoundException } from '../../../domain/entities/attachments.entity';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import { STORAGE_PROVIDER_TOKEN, StorageProvider } from '../../storage-provider';
import { DeleteAttachmentCommand } from './delete-attachment.command';

@Injectable()
export class DeleteAttachmentUsecase {
  constructor(
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute(command: DeleteAttachmentCommand): Promise<void> {
    const attachmentRecord = await this.findAttachmentOrFail(command.attachmentId);

    await this.storageProvider.delete(attachmentRecord.getPathAndName());
    await this.attachmentsRepository.delete({ ids: [command.attachmentId] });
  }

  private async findAttachmentOrFail(id: string): Promise<AttachmentEntity> {
    const item = await this.attachmentsRepository.findOne({
      ids: isUUID(id) ? [id] : undefined,
      shareTokens: !isUUID(id) ? [id] : undefined,
    });

    if (!item) {
      throw new AttachmentNotFoundException(`Attachment not found with id ${id}`);
    }
    return item;
  }
}
