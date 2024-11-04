import { Inject, Injectable } from '@nestjs/common';
import { Paginated } from '@repo/types/database';
import { UserEntity } from '../../../domain/entities/user.entity';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from '../../../domain/repositories/users.repository';
import { FindAllProfileQuery } from './find-all-profile.query';

@Injectable()
export class FindAllProfileUsecase {
  constructor(@Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository) {}

  async execute(query: FindAllProfileQuery): Promise<Paginated<UserEntity>> {
    return this.usersRepository.findAll(query.conditions, query.pagination);
  }
}
