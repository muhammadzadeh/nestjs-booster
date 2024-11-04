import { Inject, Injectable } from '@nestjs/common';
import { AttachmentEntity } from '../../../domain/entities/attachments.entity';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import { FindManyAttachmentCommand } from './find-many-attachment.command';

@Injectable()
export class FindManyAttachmentUsecase {
  constructor(
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute(command: FindManyAttachmentCommand): Promise<AttachmentEntity[]> {
    if (!command.attachmentIds.length) {
      return [];
    }

    const { items } = await this.attachmentsRepository.findAll({
      ids: command.attachmentIds,
    });
    return items;
  }
}
