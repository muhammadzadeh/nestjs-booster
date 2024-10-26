import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Paginated } from '@repo/types/database';
import { ListResponse } from '@repo/types/serialization';
import { CityEntity } from '../../domain/entities/city.entity';
import { CityResponse } from './city.response';
import { FilterCityDto } from './filter-city.dto';

export class CityListResponse extends ListResponse<CityResponse> {
  static from(data: Paginated<CityEntity>, filters: FilterCityDto): CityListResponse {
    return new CityListResponse(
      data.items.map((item) => CityResponse.from(item)),
      {
        total: data.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    );
  }

  @ApiProperty({
    type: CityResponse,
    isArray: true,
    description: 'The state cities',
  })
  @Type(() => CityResponse)
  declare items: CityResponse[];
}
