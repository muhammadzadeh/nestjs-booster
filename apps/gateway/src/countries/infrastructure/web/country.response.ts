import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CountryEntity } from '../../domain/entities/country.entity';
import { TimezoneResponse } from './timezone.response';

export class CountryResponse {
  static from(data: CountryEntity): CountryResponse {
    return {
      id: data.id,
      name: data.name,
      emoji: data.emoji,
      iso2: data.iso2,
      iso3: data.iso3,
      phoneCode: data.phoneCode,
      timezones: data.timezones.map((timezone) => TimezoneResponse.from(timezone)),
    };
  }

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly id!: string;

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly name!: string;

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly iso3!: string;

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly iso2!: string;

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly phoneCode!: string;

  @ApiProperty({
    type: TimezoneResponse,
    isArray: true,
  })
  @Type(() => TimezoneResponse)
  readonly timezones!: TimezoneResponse[];

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Type(() => String)
  readonly emoji!: string;
}
