import { Inject, Injectable } from '@nestjs/common';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import { RemoveAttachmentDraftFlagCommand } from './remove-draft-flag.command';

@Injectable()
export class RemoveAttachmentDraftFlagUsecase {
  constructor(
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute(command: RemoveAttachmentDraftFlagCommand): Promise<void> {
    if (!command.attachmentIds.length) {
      return;
    }

    await this.attachmentsRepository.update(
      {
        ids: command.attachmentIds,
      },
      {
        isDraft: false,
      },
    );
  }
}
