import { Injectable } from '@nestjs/common';
import { Paginated, PaginationOption } from '../../../common/database';
import { now } from '../../../common/time';
import { Email, Mobile, UserId, Username } from '@repo/types/common.types';
import { UserEntity, UserNotFoundException } from '../domain/entities/user.entity';
import { FindUserOptions, UserOrderBy } from '../domain/repositories/users.repository';
import { CreateUserCommand } from './usecases/create-user/create-user.command';
import { CreateUserUsecase } from './usecases/create-user/create-user.usecase';
import { FindAllProfileQuery } from './usecases/find-all-profile/find-all-profile.query';
import { FindAllProfileUsecase } from './usecases/find-all-profile/find-all-profile.usecase';
import { FindOneProfileQuery } from './usecases/find-one-profile/find-one-profile.query';
import { FindOneProfileUsecase } from './usecases/find-one-profile/find-one-profile.usecase';
import { UpdatePasswordCommand } from './usecases/update-password/update-password.command';
import { UpdatePasswordUsecase } from './usecases/update-password/update-password.usecase';
import { UpdateProfileCommand } from './usecases/update-profile/update-profile.command';
import { UpdateProfileUsecase } from './usecases/update-profile/update-profile.use-case';

@Injectable()
export class UsersService {
  constructor(
    private readonly findAllProfileUsecase: FindAllProfileUsecase,
    private readonly updatePasswordUsecase: UpdatePasswordUsecase,
    private readonly findOneProfileUsecase: FindOneProfileUsecase,
    private readonly updateProfileUsecase: UpdateProfileUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
  ) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    return this.createUserUsecase.execute(CreateUserCommand.create(data));
  }

  async findOneByIdentifierOrFail(id: Email | Username | Mobile | UserId): Promise<UserEntity> {
    const user = await this.findOneByIdentifier(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findOneByIdentifier(id: Email | Username | Mobile | UserId): Promise<UserEntity | null> {
    return this.findOneProfileUsecase.execute(FindOneProfileQuery.create({ identifier: id }));
  }

  async updatePassword(userId: UserId, password: string): Promise<void> {
    await this.updatePasswordUsecase.execute(UpdatePasswordCommand.create({ userId, password }));
  }

  async findAll(
    conditions: Partial<FindUserOptions>,
    pagination?: PaginationOption<UserOrderBy>,
  ): Promise<Paginated<UserEntity>> {
    return this.findAllProfileUsecase.execute(
      FindAllProfileQuery.create({
        conditions,
        pagination,
      }),
    );
  }

  async updateProfile(id: UserId, data: Partial<UserEntity>): Promise<void> {
    await this.updateProfileUsecase.execute(
      UpdateProfileCommand.create({
        conditions: {
          ids: [id],
        },
        data,
      }),
    );
  }

  async markUserAsVerified(user: UserEntity): Promise<void> {
    await this.updateProfile(user.id, {
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
    });
  }

  async updateLoggedInTime(user: UserEntity): Promise<void> {
    await this.updateProfile(user.id, {
      lastLoggedInAt: now().toJSDate(),
    });
  }
}

export class CreateUserData {
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly email?: Email | null;
  readonly mobile?: Mobile | null;
  readonly avatar?: string | null;
  readonly password?: string | null;
  readonly isEmailVerified?: boolean;
  readonly isMobileVerified?: boolean;
}
