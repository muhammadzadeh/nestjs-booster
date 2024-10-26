import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { camelCaseObject } from '@repo/utils';
import { lastValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';
import { BaseSeeder, DatabaseSeeder } from '../../common/database';
import { CityEntity } from '../domain/entities/city.entity';
import { CountryEntity } from '../domain/entities/country.entity';
import { StateEntity } from '../domain/entities/state.entity';
import { TypeormCityEntity } from '../infrastructure/database/entities/typeorm-city.entity';
import { TypeormCountryEntity } from '../infrastructure/database/entities/typeorm-country.entity';
import { TypeormStateEntity } from '../infrastructure/database/entities/typeorm-state.entity';

type State = StateEntity & { cities: CityEntity[] };
type Country = CountryEntity & { states: State[] };
@DatabaseSeeder()
export class CountriesSeeder extends BaseSeeder {
  private logger = new Logger(CountriesSeeder.name);

  static readonly description = 'This script will seed countries, state and city into db.';

  constructor(
    private readonly httpService: HttpService,
    private readonly datasource: DataSource,
  ) {
    super();
  }

  async run(): Promise<void> {
    const isCountriesExists = await this.datasource.manager.exists(TypeormCountryEntity);
    if (isCountriesExists) {
      return;
    }

    this.logger.verbose(`trying seed country, state and cities!`);
    const countries = await this.downloadDatasource();
    this.logger.verbose(`Seeding country and state data ...`);
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      if (!country) {
        continue;
      }

      await this.createCountryRecord(country);
    }
    this.logger.verbose(`Country data seeded successfully!`);
  }

  private async downloadDatasource(): Promise<Country[]> {
    this.logger.verbose(`Downloading countries data ...`);
    const url =
      'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json';
    const result = await lastValueFrom(this.httpService.get(url, { responseType: 'json' }));
    return camelCaseObject(result.data);
  }

  private async createCountryRecord(country: Country): Promise<void> {
    const { id, states, ...countryWithoutState } = country;

    const createdCountry = await this.datasource.manager.getRepository(TypeormCountryEntity).save(countryWithoutState);

    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      if (!state) {
        continue;
      }

      await this.createStateAndCityRecords(createdCountry.id, state);
    }
  }

  private async createStateAndCityRecords(countryId: string, state: State): Promise<void> {
    const { id, cities, stateCode, ...stateWithoutCity } = state;
    const createdState = await this.datasource.manager
      .getRepository(TypeormStateEntity)
      .save({ ...stateWithoutCity, stateCode: stateCode ?? stateWithoutCity.name, countryId });

    const mappedCities = cities.map((city) => {
      const { id, stateId, ...cityWithoutId } = city;
      return {
        ...cityWithoutId,
        stateId: createdState.id,
      };
    });
    await this.datasource.manager.getRepository(TypeormCityEntity).save(mappedCities);
  }
}
