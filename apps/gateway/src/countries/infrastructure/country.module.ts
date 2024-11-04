import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesSeeder } from '../application/countries.seeder';
import { CountriesService } from '../application/countries.service';
import { CITIES_REPOSITORY_TOKEN } from '../domain/repositories/cities.repository';
import { CITY_REGIONS_REPOSITORY_TOKEN } from '../domain/repositories/city-regions.repository';
import { COUNTRIES_REPOSITORY_TOKEN } from '../domain/repositories/countries.repository';
import { STATES_REPOSITORY_TOKEN } from '../domain/repositories/states.repository';
import { TypeormCityRegionEntity } from './database/entities/typeorm-city-region.entity';
import { TypeormCityEntity } from './database/entities/typeorm-city.entity';
import { TypeormCountryEntity } from './database/entities/typeorm-country.entity';
import { TypeormStateEntity } from './database/entities/typeorm-state.entity';
import { TypeormCitiesRepository } from './database/repositories/typeorm-cities.repository';
import { TypeormCityRegionsRepository } from './database/repositories/typeorm-city-regions.repository';
import { TypeormCountriesRepository } from './database/repositories/typeorm-countries.repository';
import { TypeormStatesRepository } from './database/repositories/typeorm-states.repository';
import { CountriesController } from './web/countries.controller';

const countriesProvider: Provider = {
  provide: COUNTRIES_REPOSITORY_TOKEN,
  useClass: TypeormCountriesRepository,
};

const statesProvider: Provider = {
  provide: STATES_REPOSITORY_TOKEN,
  useClass: TypeormStatesRepository,
};

const citiesProvider: Provider = {
  provide: CITIES_REPOSITORY_TOKEN,
  useClass: TypeormCitiesRepository,
};

const cityRegionsProvider: Provider = {
  provide: CITY_REGIONS_REPOSITORY_TOKEN,
  useClass: TypeormCityRegionsRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeormCountryEntity, TypeormStateEntity, TypeormCityEntity, TypeormCityRegionEntity]),
    HttpModule,
  ],
  providers: [
    CountriesSeeder,
    countriesProvider,
    CountriesService,
    statesProvider,
    citiesProvider,
    cityRegionsProvider,
  ],
  controllers: [CountriesController],
  exports: [CountriesService],
})
export class CountryModule {}
