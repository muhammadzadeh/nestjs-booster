import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneNotificationDto {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID('4')
  id!: string;
}
