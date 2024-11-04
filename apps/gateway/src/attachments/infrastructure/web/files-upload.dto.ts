import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class FilesUploadDto {
  @ApiProperty({ required: true, type: 'array', items: { type: 'string', format: 'binary' } })
  @ArrayNotEmpty()
  @IsArray()
  files!: unknown[];
}
