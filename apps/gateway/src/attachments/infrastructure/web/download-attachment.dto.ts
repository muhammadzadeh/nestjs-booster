import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
export class DownloadAttachmentDto {
  @ApiProperty({
    type: String,
    description: 'The attachment UUID',
    example: 'fa9a52b2-b56d-43ff-b96e-5989665457f9',
  })
  @IsNotEmpty()
  @IsUUID()
  id!: string;
}

export class DownloadSharedAttachmentDto {
  @ApiProperty({
    type: String,
    description: 'The attachment shared token',
    example: 'fa9a52b2b56d43ffb96e5989665457f9',
  })
  @IsNotEmpty()
  token!: string;
}
