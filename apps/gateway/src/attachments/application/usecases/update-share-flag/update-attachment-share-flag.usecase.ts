import { Inject, Injectable } from '@nestjs/common';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import { UpdateAttachmentShareFlagCommand } from './update-attachment-share-flag.command';

@Injectable()
export class UpdateAttachmentShareFlagUsecase {
  constructor(
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute(command: UpdateAttachmentShareFlagCommand): Promise<void> {
    if (!command.attachmentIds.length) {
      return;
    }

    const { items } = await this.attachmentsRepository.findAll({
      ids: command.attachmentIds,
    });

    for (let i = 0; i < items.length; i++) {
      const attachment = items[i];
      if (!attachment) {
        continue;
      }

      await attachment.updateSharedFlag(command.isShared);
      await this.attachmentsRepository.save(attachment);
    }
  }
}
