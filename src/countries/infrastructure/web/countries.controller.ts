import { Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IgnoreAuthorizationGuard } from '../../../authentication/infrastructure/web/decorators';
import { FineOneUUIDDto } from '../../../common/dto/find-one-uuid.dto';
import { CommonController } from '../../../common/guards/decorators';
import { CountriesService } from '../../application/countries.service';
import { CityListResponse } from './city-list.response';
import { CityRegionListResponse } from './city-region-list.response';
import { CountryListResponse } from './country-list.response';
import { FilterCityDto } from './filter-city.dto';
import { FilterCountryDto } from './filter-country.dto';
import { FilterRegionDto } from './filter-regions.dto';
import { FilterStateDto } from './filter-state.dto';
import { StateListResponse } from './state-list.response';

@IgnoreAuthorizationGuard()
@CommonController()
@ApiTags('Countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('countries')
  @ApiOkResponse({
    status: 200,
    type: CountryListResponse,
  })
  async findCountries(@Query() filters: FilterCountryDto): Promise<CountryListResponse> {
    const result = await this.countriesService.findCountries(
      {
        searchTerm: filters.searchTerm,
      },
      {
        page: filters.page,
        pageSize: filters.pageSize,
        orderBy: filters.orderBy,
        orderDir: filters.orderDir,
      },
    );
    return CountryListResponse.from(result, filters);
  }

  @Get('countries/:id/states')
  @ApiOkResponse({
    status: 200,
    type: StateListResponse,
  })
  async findCountryStates(
    @Param() params: FineOneUUIDDto,
    @Query() filters: FilterStateDto,
  ): Promise<StateListResponse> {
    const result = await this.countriesService.findStates(
      {
        searchTerm: filters.searchTerm,
        countryId: params.id,
      },
      {
        page: filters.page,
        pageSize: filters.pageSize,
        orderBy: filters.orderBy,
        orderDir: filters.orderDir,
      },
    );
    return StateListResponse.from(result, filters);
  }

  @Get('states/:id/cities')
  @ApiOkResponse({
    status: 200,
    type: CityListResponse,
  })
  async findStateCities(@Param() params: FineOneUUIDDto, @Query() filters: FilterCityDto): Promise<CityListResponse> {
    const result = await this.countriesService.findCities(
      {
        searchTerm: filters.searchTerm,
        stateId: params.id,
      },
      {
        page: filters.page,
        pageSize: filters.pageSize,
        orderBy: filters.orderBy,
        orderDir: filters.orderDir,
      },
    );
    return CityListResponse.from(result, filters);
  }

  @Get('cities/:id/regions')
  @ApiOkResponse({
    status: 200,
    type: CityRegionListResponse,
  })
  async findCityRegions(
    @Param() params: FineOneUUIDDto,
    @Query() filters: FilterRegionDto,
  ): Promise<CityRegionListResponse> {
    const result = await this.countriesService.findRegions(
      {
        searchTerm: filters.searchTerm,
        cityId: params.id,
      },
      {
        page: filters.page,
        pageSize: filters.pageSize,
        orderBy: filters.orderBy,
        orderDir: filters.orderDir,
      },
    );
    return CityRegionListResponse.from(result, filters);
  }
}
