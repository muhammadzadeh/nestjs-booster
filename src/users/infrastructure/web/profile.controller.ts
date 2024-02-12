import { Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../authenticate/infrastructure/web/decorators';
import { CommonController } from '../../../common/guards/decorators';
import { Serializer } from '../../../common/serialization';
import { UsersService } from '../../application/users.service';
import { UserResponse } from './user.response';

@ApiTags('Profile')
@CommonController(`/profile`)
export class AuthenticationController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    status: 200,
    type: UserResponse,
  })
  async signupByGoogle(@CurrentUser() user: CurrentUser): Promise<UserResponse> {
    const userProfile = await this.usersService.findOneByIdentifierOrFail(user.id);
    return Serializer.serialize(UserResponse, userProfile);
  }
}
