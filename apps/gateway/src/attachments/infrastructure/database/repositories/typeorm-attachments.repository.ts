import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Paginated } from '@repo/types/database';
import { STORAGE_PROVIDER_TOKEN, StorageProvider } from '../../../application/storage-provider';
import { AttachmentEntity, AttachmentVisibility } from '../../../domain/entities/attachments.entity';
import { AttachmentsRepository, FindAttachmentOptions } from '../../../domain/repositories/attachments.repository';
import { TypeormAttachmentEntity } from '../entities';

@Injectable()
export class TypeormAttachmentsRepository implements AttachmentsRepository {
  constructor(
    @InjectRepository(TypeormAttachmentEntity)
    private readonly repository: Repository<TypeormAttachmentEntity>,
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: StorageProvider,
  ) {}
  async findAll(options: FindAttachmentOptions): Promise<Paginated<AttachmentEntity>> {
    const queryBuilder = this.buildSelectQuery(options, 'attachment');

    const [items, count] = await queryBuilder.getManyAndCount();
    return {
      total: count,
      items: items.map((item) => TypeormAttachmentEntity.toAttachmentEntity(item, this.getBaseUrl(item.visibility))),
    };
  }

  async save(data: AttachmentEntity): Promise<AttachmentEntity> {
    const item = await this.repository.save(data);
    return TypeormAttachmentEntity.toAttachmentEntity(item, this.getBaseUrl(item.visibility));
  }

  async findOne(options: FindAttachmentOptions): Promise<AttachmentEntity | null> {
    const queryBuilder = this.buildSelectQuery(options, 'attachment');

    const item = await queryBuilder.getOne();
    return item ? TypeormAttachmentEntity.toAttachmentEntity(item, this.getBaseUrl(item.visibility)) : null;
  }

  async exists(options: FindAttachmentOptions): Promise<boolean> {
    const queryBuilder = this.buildSelectQuery(options, 'attachment');
    return await queryBuilder.getExists();
  }

  async delete(options: FindAttachmentOptions): Promise<void> {
    const queryBuilder = this.buildSelectQuery(options, 'attachment');
    await queryBuilder.softDelete().execute();
  }

  async update(options: FindAttachmentOptions, data: Partial<AttachmentEntity>): Promise<void> {
    const queryBuilder = this.buildSelectQuery(options);
    await queryBuilder.update(TypeormAttachmentEntity).set(data).execute();
  }

  private buildSelectQuery(
    options: FindAttachmentOptions,
    alias?: string,
  ): SelectQueryBuilder<TypeormAttachmentEntity> {
    const queryBuilder = this.repository.createQueryBuilder(alias);
    if (options.ids) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}id IN(:...ids)`, { ids: options.ids });
    }
    if (options.shareTokens) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}shareToken IN(:...shareTokens)`, {
        shareTokens: options.shareTokens,
      });
    }
    if (options.isShared != undefined) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}isShared = :isShared`, { isShared: options.isShared });
    }
    return queryBuilder;
  }

  private getBaseUrl(visibility: AttachmentVisibility): string {
    return visibility === AttachmentVisibility.PRIVATE
      ? this.storageProvider.getPrivateBaseUrl()
      : this.storageProvider.getPublicBaseUrl();
  }
}
