import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Paginated } from '@repo/types/database';
import { ListResponse } from '../../../common/serialization';
import { CityRegionEntity } from '../../domain/entities/city-region.entity';
import { CityRegionResponse } from './city-region.response';
import { FilterRegionDto } from './filter-regions.dto';

export class CityRegionListResponse extends ListResponse<CityRegionResponse> {
  static from(data: Paginated<CityRegionEntity>, filters: FilterRegionDto): CityRegionListResponse {
    return new CityRegionListResponse(
      data.items.map((item) => CityRegionResponse.from(item)),
      {
        total: data.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    );
  }

  @ApiProperty({
    type: CityRegionResponse,
    isArray: true,
    description: 'The city regions',
  })
  @Type(() => CityRegionResponse)
  declare items: CityRegionResponse[];
}
