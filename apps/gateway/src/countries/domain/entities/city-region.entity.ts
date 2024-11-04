import { randomUUID } from 'crypto';

export class CityRegionEntity {
  constructor(cityId: string, name: string);
  constructor(cityId: string, name: string, id: string);
  constructor(cityId: string, name: string, id?: string) {
    this.id = id ?? randomUUID();
    this.cityId = cityId;
    this.name = name;
  }

  readonly id!: string;
  readonly cityId!: string;
  readonly name!: string;
}
