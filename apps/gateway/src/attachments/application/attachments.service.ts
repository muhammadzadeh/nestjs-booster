import { Injectable } from '@nestjs/common';
import { AttachmentId } from '../domain/entities/attachment-users.entity';
import { AttachmentEntity } from '../domain/entities/attachments.entity';
import { DeleteAttachmentCommand } from './usecases/delete/delete-attachment.command';
import { DeleteAttachmentUsecase } from './usecases/delete/delete-attachment.usecase';
import { DownloadCommand } from './usecases/download/download.command';
import { DownloadAttachmentResult, DownloadUsecase } from './usecases/download/download.usecase';
import { FindManyAttachmentCommand } from './usecases/find-many/find-many-attachment.command';
import { FindManyAttachmentUsecase } from './usecases/find-many/find-many-attachment.usecase';
import { RemoveAttachmentDraftFlagCommand } from './usecases/remove-draft-flag/remove-draft-flag.command';
import { RemoveAttachmentDraftFlagUsecase } from './usecases/remove-draft-flag/remove-draft-flag.usecase';
import {
  GrantAttachmentAccess,
  RevokeAttachmentAccess,
} from './usecases/update-access/update-attachment-access.command';
import { UpdateAttachmentAccessUsecase } from './usecases/update-access/update-attachment-access.usecase';
import { UpdateAttachmentShareFlagCommand } from './usecases/update-share-flag/update-attachment-share-flag.command';
import { UpdateAttachmentShareFlagUsecase } from './usecases/update-share-flag/update-attachment-share-flag.usecase';
import { UploadCommand } from './usecases/upload/upload.command';
import { UploadUsecase } from './usecases/upload/upload.usecase';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly updateShareFlagUsecase: UpdateAttachmentShareFlagUsecase,
    private readonly removeDraftFlagUsecase: RemoveAttachmentDraftFlagUsecase,
    private readonly updateAccessUsecase: UpdateAttachmentAccessUsecase,
    private readonly findManyUsecase: FindManyAttachmentUsecase,
    private readonly deleteUsecase: DeleteAttachmentUsecase,
    private readonly downloadUsecase: DownloadUsecase,
    private readonly uploadUsecase: UploadUsecase,
  ) {}

  async upload(command: UploadCommand): Promise<AttachmentEntity> {
    return await this.uploadUsecase.execute(command);
  }

  async download(command: DownloadCommand): Promise<DownloadAttachmentResult> {
    return await this.downloadUsecase.execute(command);
  }

  async delete(command: DeleteAttachmentCommand): Promise<void> {
    await this.deleteUsecase.execute(command);
  }

  async findOne(attachmentId: AttachmentId): Promise<AttachmentEntity | null> {
    const items = await this.findMany({ attachmentIds: [attachmentId] });
    return items[0] ?? null;
  }

  async findMany(command: FindManyAttachmentCommand): Promise<AttachmentEntity[]> {
    return await this.findManyUsecase.execute(command);
  }

  async grantAttachmentAccess(options: GrantAttachmentAccess): Promise<void> {
    await this.updateAccessUsecase.execute({
      grant: options,
    });
  }

  async revokeAttachmentAccess(options: RevokeAttachmentAccess): Promise<void> {
    await this.updateAccessUsecase.execute({
      revoke: options,
    });
  }

  async removeDraftFlag(command: RemoveAttachmentDraftFlagCommand): Promise<void> {
    await this.removeDraftFlagUsecase.execute(command);
  }

  async updateSharedFlag(command: UpdateAttachmentShareFlagCommand): Promise<void> {
    await this.updateShareFlagUsecase.execute(command);
  }
}
