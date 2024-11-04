import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MimeTypeResponse {
  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  ext!: string;

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  mime!: string;
}
