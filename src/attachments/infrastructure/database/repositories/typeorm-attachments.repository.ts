import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Pagination } from '../../../../common/database';
import { AttachmentEntity } from '../../../domain/entities/attachments.entity';
import { AttachmentsRepository, FindAttachmentOptions } from '../../../domain/repositories/attachments.repository';
import { TypeormAttachmentEntity } from '../entities';

@Injectable()
export class TypeormAttachmentsRepository implements AttachmentsRepository {
  constructor(
    @InjectRepository(TypeormAttachmentEntity)
    private readonly repository: Repository<TypeormAttachmentEntity>,
  ) {}
  async findAll(options: FindAttachmentOptions): Promise<Pagination<AttachmentEntity>> {
    const queryBuilder = this.buildSelectQuery(options, 'attachment');

    const [items, count] = await queryBuilder.getManyAndCount();
    return {
      total: count,
      items: items.map((item) => TypeormAttachmentEntity.toAttachmentEntity(item)),
    };
  }

  async save(data: AttachmentEntity): Promise<AttachmentEntity> {
    const item = await this.repository.save(data);
    return TypeormAttachmentEntity.toAttachmentEntity(item);
  }

  async findOne(options: FindAttachmentOptions): Promise<AttachmentEntity | null> {
    const queryBuilder = this.buildSelectQuery(options, 'attachment');

    const item = await queryBuilder.getOne();
    return item ? TypeormAttachmentEntity.toAttachmentEntity(item) : null;
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
    return queryBuilder;
  }
}