import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttachmentUserEntity } from '../../../domain/entities/attachment-users.entity';
import {
  AttachmentUsersRepository,
  FindAttachmentUserOptions,
} from '../../../domain/repositories/attachment-users.repository';
import { TypeormAttachmentUserEntity } from '../entities';

@Injectable()
export class TypeormAttachmentUsersRepository implements AttachmentUsersRepository {
  constructor(
    @InjectRepository(TypeormAttachmentUserEntity)
    private readonly repository: Repository<TypeormAttachmentUserEntity>,
  ) {}

  async save(data: AttachmentUserEntity): Promise<void> {
    await this.repository.upsert(data, {
      conflictPaths: { attachmentId: true, userId: true },
    });
  }

  async exists(options: FindAttachmentUserOptions): Promise<boolean> {
    return await this.repository.exists({
      where: options,
    });
  }

  async delete(options: FindAttachmentUserOptions): Promise<void> {
    await this.repository.delete(options);
  }
}
