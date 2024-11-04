import { randomUUID } from 'crypto';

export class CityEntity {
  constructor(stateId: string, name: string);
  constructor(stateId: string, name: string, id: string);
  constructor(stateId: string, name: string, id?: string) {
    this.id = id ?? randomUUID();
    this.stateId = stateId;
    this.name = name;
  }

  readonly id!: string;
  readonly stateId!: string;
  readonly name!: string;
}
