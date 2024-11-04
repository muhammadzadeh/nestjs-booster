import { Module, Provider } from '@nestjs/common';
import { AttachmentsService } from './application/attachments.service';
import { STORAGE_PROVIDER_TOKEN, StorageProvider } from './application/storage-provider';
import { DeleteAttachmentUsecase } from './application/usecases/delete/delete-attachment.usecase';
import { DownloadUsecase } from './application/usecases/download/download.usecase';
import { FindManyAttachmentUsecase } from './application/usecases/find-many/find-many-attachment.usecase';
import { RemoveAttachmentDraftFlagUsecase } from './application/usecases/remove-draft-flag/remove-draft-flag.usecase';
import { UpdateAttachmentAccessUsecase } from './application/usecases/update-access/update-attachment-access.usecase';
import { UpdateAttachmentShareFlagUsecase } from './application/usecases/update-share-flag/update-attachment-share-flag.usecase';
import { UploadUsecase } from './application/usecases/upload/upload.usecase';
import { ATTACHMENT_USERS_REPOSITORY_TOKEN } from './domain/repositories/attachment-users.repository';
import { ATTACHMENTS_REPOSITORY_TOKEN } from './domain/repositories/attachments.repository';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '@repo/config';
import { TypeormAttachmentEntity, TypeormAttachmentUserEntity } from './infrastructure/database/entities';
import { TypeormAttachmentUsersRepository, TypeormAttachmentsRepository } from './infrastructure/database/repositories';
import { LocalStorageProvider, MinioStorageProvider } from './infrastructure/providers';
import { AttachmentsController } from './infrastructure/web';
import { IsPrivateAttachmentConstraint } from './infrastructure/web/is-private-attachment.validator';

const uploaderProvider: Provider = {
  provide: STORAGE_PROVIDER_TOKEN,
  inject: [Configuration],
  useFactory: (config: Configuration): StorageProvider => {
    let uploader: StorageProvider | undefined = undefined;

    switch (config.storage.type) {
      case 'minio':
        uploader = new MinioStorageProvider({
          endpoint: config.storage.minio!.storageEndpoint,
          accessKeyId: config.storage.minio!.accessKeyId,
          secretAccessKey: config.storage.minio!.secretAccessKey,
          privateBucketName: config.storage.minio!.privateBucket,
          publicBucketName: config.storage.minio!.publicBucket,
          privateBaseUrl: config.storage.minio!.privateBaseUrl,
          publicBaseUrl: config.storage.minio!.publicBaseUrl,
        });
        break;
      case 'r2':
        uploader = new MinioStorageProvider({
          endpoint: config.storage.r2!.storageEndpoint,
          accessKeyId: config.storage.r2!.accessKeyId,
          secretAccessKey: config.storage.r2!.secretAccessKey,
          privateBucketName: config.storage.r2!.privateBucket,
          publicBucketName: config.storage.r2!.publicBucket,
          privateBaseUrl: config.storage.minio!.privateBaseUrl,
          publicBaseUrl: config.storage.minio!.publicBaseUrl,
        });
        break;
      case 'local':
        uploader = new LocalStorageProvider({
          localStoragePath: config.storage.local!.uploadDir,
          privateDir: config.storage.local!.privateDir,
          publicDir: config.storage.local!.publicDir,
          privateBaseUrl: config.storage.local!.privateBaseUrl,
          publicBaseUrl: config.storage.local!.publicBaseUrl,
        });
        break;
      default:
        uploader = new LocalStorageProvider({
          localStoragePath: config.storage.local!.uploadDir,
          privateDir: config.storage.local!.privateDir,
          publicDir: config.storage.local!.publicDir,
          privateBaseUrl: config.storage.local!.privateBaseUrl,
          publicBaseUrl: config.storage.local!.publicBaseUrl,
        });
    }

    return uploader;
  },
};

@Module({
  imports: [TypeOrmModule.forFeature([TypeormAttachmentEntity, TypeormAttachmentUserEntity])],
  controllers: [AttachmentsController],
  providers: [
    AttachmentsService,
    uploaderProvider,
    {
      provide: ATTACHMENTS_REPOSITORY_TOKEN,
      useClass: TypeormAttachmentsRepository,
    },
    {
      provide: ATTACHMENT_USERS_REPOSITORY_TOKEN,
      useClass: TypeormAttachmentUsersRepository,
    },
    IsPrivateAttachmentConstraint,
    UploadUsecase,
    DownloadUsecase,
    FindManyAttachmentUsecase,
    DeleteAttachmentUsecase,
    UpdateAttachmentAccessUsecase,
    RemoveAttachmentDraftFlagUsecase,
    UpdateAttachmentShareFlagUsecase,
  ],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
