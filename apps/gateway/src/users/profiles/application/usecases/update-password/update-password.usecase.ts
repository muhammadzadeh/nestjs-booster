import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../../../domain/entities/user.entity';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from '../../../domain/repositories/users.repository';
import { UpdatePasswordCommand } from './update-password.command';

@Injectable()
export class UpdatePasswordUsecase {
  constructor(@Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository) {}

  async execute(command: UpdatePasswordCommand): Promise<void> {
    const user = await this.usersRepository.findOne({ ids: [command.userId] });
    if (!user) {
      throw new UserNotFoundException();
    }

    user.updatePassword(command.password);
    await this.usersRepository.save(user);
  }
}
