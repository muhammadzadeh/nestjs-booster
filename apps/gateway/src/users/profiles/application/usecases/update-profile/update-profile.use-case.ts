import { Inject, Injectable } from '@nestjs/common';
import { AttachmentsService } from '../../../../../attachments/application/attachments.service';
import { InvalidAvatarException } from '../../../domain/entities/user.entity';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from '../../../domain/repositories/users.repository';
import { UpdateProfileCommand } from './update-profile.command';

@Injectable()
export class UpdateProfileUsecase {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository,
    private readonly attachmentService: AttachmentsService,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<void> {
    if (command.data.avatarId) {
      const avatarRecord = await this.attachmentService.findOne(command.data.avatarId);
      if (!avatarRecord) {
        throw new InvalidAvatarException(`Avatar not found!`);
      }

      if (avatarRecord.isPrivate()) {
        throw new InvalidAvatarException(`Only public attachment allowed for avatar!`);
      }

      command.data.avatar = avatarRecord.url;
      command.data.avatarId = avatarRecord.id;
    }

    await this.usersRepository.update(command.conditions, command.data);
  }
}
