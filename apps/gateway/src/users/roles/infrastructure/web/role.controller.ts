import { Body, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminController } from '@repo/decorator';
import { RequiredPermissions } from '../../../../authentication/infrastructure/web/decorators';
import { DoneResponse } from '@repo/types/serialization';
import { RolesService } from '../../application/roles.service';
import { Permission } from '../../domain/entities/role.entity';
import { CreateRoleDto } from './create-role.dto';
import { FilterRoleDto } from './filter-role.dto';
import { GetRoleDto } from './get-role.dto';
import { RoleListResponse } from './role-list.response';
import { UpdateRoleDto } from './update-role.dto';

@ApiTags('Roles')
@AdminController(`/roles`)
export class RoleController {
  constructor(private readonly rolesService: RolesService) {}
  @Post()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  @RequiredPermissions(Permission.WRITE_ROLES)
  async createRole(@Body() data: CreateRoleDto): Promise<DoneResponse> {
    await this.rolesService.createRole(data);
    return new DoneResponse();
  }

  @Put(':id')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  @RequiredPermissions(Permission.WRITE_ROLES)
  async updateRole(@Param() params: GetRoleDto, @Body() data: UpdateRoleDto): Promise<DoneResponse> {
    await this.rolesService.updateRole(params.id, data);
    return new DoneResponse();
  }

  @Get()
  @ApiOkResponse({
    status: 200,
    type: RoleListResponse,
  })
  @RequiredPermissions(Permission.READ_ROLES)
  async getRoles(@Query() filters: FilterRoleDto): Promise<RoleListResponse> {
    const result = await this.rolesService.findAll(
      {},
      {
        page: filters.page,
        pageSize: filters.pageSize,
        orderBy: filters.orderBy,
        orderDir: filters.orderDir,
      },
    );
    return RoleListResponse.from(result, filters);
  }
}
