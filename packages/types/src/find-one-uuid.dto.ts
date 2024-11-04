import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FineOneUUIDDto {
  @ApiProperty({ type: String, description: 'The Id' })
  @IsNotEmpty()
  @IsUUID('4')
  id!: string;
}
