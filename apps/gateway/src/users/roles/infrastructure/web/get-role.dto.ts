import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetRoleDto {
  @IsNotEmpty()
  @IsUUID('4')
  id!: string;
}
