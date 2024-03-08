import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CityEntity } from '../../domain/entities/city.entity';

export class CityResponse {
  static from(data: CityEntity): CityResponse {
    return {
      id: data.id,
      name: data.name,
    };
  }

  @ApiProperty({
    type: String,
    name: 'id',
  })
  @Type(() => String)
  readonly id!: string;

  @ApiProperty({
    type: String,
    name: 'name',
  })
  @Type(() => String)
  readonly name!: string;
}
