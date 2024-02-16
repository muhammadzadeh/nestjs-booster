import { Body, Get, Param, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequiredPermissions } from '../../../../../authenticate/infrastructure/web/decorators';
import { AdminController } from '../../../../../common/guards/decorators';
import { DoneResponse, Serializer } from '../../../../../common/serialization';
import { ResponseGroup } from '../../../../../common/types';
import { Permission } from '../../../../roles/domain/entities/role.entity';
import { UsersService } from '../../../application/users.service';
import { GetUserDto } from '../common/get-user.dto';
import { UserListResponse } from '../common/user-list.response';
import { UserResponse } from '../common/user.response';
import { UpdateUserRoleDto } from './update-user-role.dto';

@ApiTags('Users')
@AdminController(`/users`)
export class ProfileControllerForAdmin {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    status: 200,
    type: UserListResponse,
  })
  @RequiredPermissions(Permission.READ_USERS)
  async getAllUsers(): Promise<UserListResponse> {
    const result = await this.usersService.findAll({});
    return Serializer.serialize(UserListResponse, result, [ResponseGroup.ADMIN_LIST]);
  }

  @Get(':id')
  @ApiOkResponse({
    status: 200,
    type: UserResponse,
  })
  @RequiredPermissions(Permission.READ_USERS)
  async getUserById(@Param() params: GetUserDto): Promise<UserResponse> {
    const userProfile = await this.usersService.findOneByIdentifierOrFail(params.id);
    return Serializer.serialize(UserResponse, userProfile, [ResponseGroup.ADMIN]);
  }

  @Patch(':id/role')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  @RequiredPermissions(Permission.WRITE_USERS)
  async updateMyProfile(@Param() params: GetUserDto, @Body() data: UpdateUserRoleDto): Promise<DoneResponse> {
    await this.usersService.updateProfile(params.id, data.toEntity());
    return Serializer.done();
  }
}
