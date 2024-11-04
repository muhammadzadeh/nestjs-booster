import { Body, Get, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserController } from '@repo/decorator';
import { CurrentUser } from '../../../../../authentication/infrastructure/web/decorators';
import { DoneResponse } from '@repo/types/serialization';
import { UsersService } from '../../../application/users.service';
import { UserResponse } from '../common/user.response';
import { UpdateMyProfileDto } from './update-my-profile.dto';

@ApiTags('Profile')
@UserController(`/profile`)
export class ProfileControllerForUser {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    status: 200,
    type: UserResponse,
  })
  async getMyProfile(@CurrentUser() user: CurrentUser): Promise<UserResponse> {
    const userProfile = await this.usersService.findOneByIdentifierOrFail(user.id);
    return UserResponse.from(userProfile);
  }

  @Put()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async updateMyProfile(@CurrentUser() user: CurrentUser, @Body() data: UpdateMyProfileDto): Promise<DoneResponse> {
    await this.usersService.updateProfile(user.id, data.toEntity());
    return new DoneResponse();
  }
}
