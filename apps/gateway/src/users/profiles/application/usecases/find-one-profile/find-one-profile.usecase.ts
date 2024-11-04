import { Inject, Injectable } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { isUUID } from 'validator';
import { UserEntity } from '../../../domain/entities/user.entity';
import {
  FindUserOptions,
  USERS_REPOSITORY_TOKEN,
  UsersRepository,
} from '../../../domain/repositories/users.repository';
import { FindOneProfileQuery } from './find-one-profile.query';

@Injectable()
export class FindOneProfileUsecase {
  constructor(@Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository) {}

  async execute(query: FindOneProfileQuery): Promise<UserEntity | null> {
    const options: Partial<FindUserOptions> = {};
    if (isEmail(query.identifier)) {
      options.emails = [query.identifier];
    } else if (isUUID(query.identifier)) {
      options.ids = [query.identifier];
    } else if (isPhoneNumber(query.identifier)) {
      options.mobiles = [query.identifier];
    } else {
      options.usernames = [query.identifier];
    }

    return this.usersRepository.findOne(options);
  }
}
