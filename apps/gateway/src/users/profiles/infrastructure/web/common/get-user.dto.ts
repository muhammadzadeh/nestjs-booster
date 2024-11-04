import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserId } from '@repo/types/common.types';

export class GetUserDto {
  @IsNotEmpty()
  @IsUUID('4')
  id!: UserId;
}
