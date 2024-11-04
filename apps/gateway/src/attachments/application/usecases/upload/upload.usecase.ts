import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseHttpException } from '@repo/exception/base.exception';
import { ErrorCode } from '@repo/types/error-code.enum';
import { AttachmentEntity, AttachmentVisibility } from '../../../domain/entities/attachments.entity';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import { FileInfo, STORAGE_PROVIDER_TOKEN, StorageProvider } from '../../storage-provider';
import { UploadCommand } from './upload.command';

@Injectable()
export class UploadUsecase {
  constructor(
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute(command: UploadCommand): Promise<AttachmentEntity> {
    await this.validateFile(command.file);

    const filePath = this.getFileStorePath(command);

    const createdAttachment = new AttachmentEntity(
      command.file.originalName,
      command.visibility,
      command.file.mimeType,
      command.userId,
      command.isDraft,
      filePath,
    );

    await this.storageProvider.upload({
      path: createdAttachment.getPathAndName(),
      mimeType: command.file.mimeType,
      fileData: command.file.fileData,
    });

    const savedAttachment = await this.attachmentsRepository.save(createdAttachment);

    return savedAttachment;
  }

  private getFileStorePath(command: UploadCommand): string {
    if (command.storePath) {
      return command.storePath;
    }

    return command.visibility === AttachmentVisibility.PRIVATE
      ? `${this.storageProvider.getPrivateBucketName()}/${command.userId}`
      : `${this.storageProvider.getPublicBucketName()}/attachments`;
  }

  private async validateFile(file: FileInfo): Promise<void> {
    if (!file.mimeType.ext || !file.mimeType.mime) {
      throw new InvalidAttachmentFormatException(`Unknown file format!`);
    }

    if (!SupportedMimeTypes.has(file.mimeType.mime)) {
      throw new InvalidAttachmentFormatException(`${file.mimeType.mime} is not supported!`);
    }
  }
}

const SupportedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'video/mp4',
  'audio/midi',
  'video/x-matroska',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/mpeg',
  'audio/mpeg',
  'audio/mpeg',
  'audio/x-m4a',
  'audio/ogg',
  'application/pdf',
  'text/vcard',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'image/webp',
  'application/sql',
]);

export class AttachmentIsTooBigException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.PAYLOAD_TOO_LARGE;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.ATTACHMENT_IS_TOO_BIG;
}

export class InvalidAttachmentFormatException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.BAD_REQUEST;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.INVALID_FORMAT;
}

export class AttachmentsShouldNotBeEmptyException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.BAD_REQUEST;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.ATTACHMENT_LIST_EMPTY;
}
