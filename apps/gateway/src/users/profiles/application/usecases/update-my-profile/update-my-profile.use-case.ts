import { Inject, Injectable } from '@nestjs/common';
import { isUUID } from 'validator';
import { AttachmentsService } from '../../../../../attachments/application/attachments.service';
import { InvalidAvatarException, UserNotFoundException } from '../../../domain/entities/user.entity';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from '../../../domain/repositories/users.repository';
import { UpdateMyProfileCommand } from './update-my-profile.command';

@Injectable()
export class UpdateMyProfileUsecase {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository,
    private readonly attachmentService: AttachmentsService,
  ) {}

  async execute(command: UpdateMyProfileCommand): Promise<void> {
    const user = await this.usersRepository.findOne({
      ids: [command.userId],
    });
    if (!user) {
      throw new UserNotFoundException(`User with id(${command.userId}) does not exists!`);
    }

    user.updateName(command.firstName, command.lastName);

    if (command.avatar && isUUID(command.avatar, '4')) {
      const avatarRecord = await this.attachmentService.findOne(command.avatar);
      if (!avatarRecord) {
        throw new InvalidAvatarException(`Avatar not found!`);
      }

      if (avatarRecord.isPrivate()) {
        throw new InvalidAvatarException(`Only public attachment allowed for avatar!`);
      }

      user.updateAvatar(avatarRecord.getPathAndName(), avatarRecord.id);
    } else {
      user.removeAvatar();
    }

    await this.usersRepository.save(user);
  }
}
