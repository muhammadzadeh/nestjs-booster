import { IsNotEmpty, IsUUID } from 'class-validator';

export class FineOneUUIDDto {
  @IsNotEmpty()
  @IsUUID('4')
  id!: string;
}
