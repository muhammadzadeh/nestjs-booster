import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class AddPushTokenDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  token!: string;
}
