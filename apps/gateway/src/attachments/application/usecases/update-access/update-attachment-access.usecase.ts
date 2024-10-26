import { Inject, Injectable } from '@nestjs/common';
import { AttachmentUserEntity } from '../../../domain/entities/attachment-users.entity';
import {
  ATTACHMENT_USERS_REPOSITORY_TOKEN,
  AttachmentUsersRepository,
} from '../../../domain/repositories/attachment-users.repository';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import {
  GrantAttachmentAccess,
  RevokeAttachmentAccess,
  UpdateAttachmentAccessCommand,
} from './update-attachment-access.command';

@Injectable()
export class UpdateAttachmentAccessUsecase {
  constructor(
    @Inject(ATTACHMENT_USERS_REPOSITORY_TOKEN)
    private readonly attachmentUsersRepository: AttachmentUsersRepository,
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute(command: UpdateAttachmentAccessCommand): Promise<void> {
    if (command.revoke) {
      await this.revokeAttachmentAccess(command.revoke);
    }

    if (command.grant) {
      await this.grantAttachmentAccess(command.grant);
    }
  }

  private async grantAttachmentAccess(options: GrantAttachmentAccess): Promise<void> {
    for (let j = 0; j < options.attachmentIds.length; j++) {
      const attachmentId = options.attachmentIds[j];
      if (!attachmentId) {
        continue;
      }

      for (let i = 0; i < options.userIds.length; i++) {
        const userId = options.userIds[i];
        if (!userId) {
          continue;
        }

        await this.attachmentUsersRepository.save(new AttachmentUserEntity(attachmentId, userId));
      }
    }

    await this.removeDraftFlag(options.attachmentIds);
  }

  private async removeDraftFlag(attachmentIds: string[]): Promise<void> {
    if (!attachmentIds.length) {
      return;
    }

    await this.attachmentsRepository.update(
      {
        ids: attachmentIds,
      },
      {
        isDraft: false,
      },
    );
  }

  private async revokeAttachmentAccess(options: RevokeAttachmentAccess): Promise<void> {
    if (options.attachmentId && options.userIds) {
      await this.revokeAttachmentAccessForSomeUsers(options);
    } else if (options.attachmentId) {
      await this.revokeAttachmentAccessFoAllUsers(options);
    }
  }

  private async revokeAttachmentAccessForSomeUsers(options: RevokeAttachmentAccess): Promise<void> {
    if (options.attachmentId && options.userIds) {
      for (let i = 0; i < options.userIds.length; i++) {
        const userId = options.userIds[i];
        await this.attachmentUsersRepository.delete({
          attachmentId: options.attachmentId,
          userId: userId,
        });
      }
    } else if (options.attachmentId) {
      await this.revokeAttachmentAccessFoAllUsers(options);
    }
  }

  private async revokeAttachmentAccessFoAllUsers(options: RevokeAttachmentAccess): Promise<void> {
    await this.attachmentUsersRepository.delete({
      attachmentId: options.attachmentId,
    });
  }
}
