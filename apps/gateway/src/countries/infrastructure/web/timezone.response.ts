import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Timezone } from '../../domain/entities/country.entity';

export class TimezoneResponse {
  static from(data: Timezone): TimezoneResponse {
    return {
      zoneName: data.zoneName,
      gmtOffsetName: data.gmtOffsetName,
    };
  }
  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly zoneName!: string;

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly gmtOffsetName!: string;
}
