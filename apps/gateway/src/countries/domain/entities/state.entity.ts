import { randomUUID } from 'crypto';

export class StateEntity {
  constructor(countryId: string, name: string);
  constructor(countryId: string, name: string, id: string, stateCode: string | null, type: string | null);
  constructor(countryId: string, name: string, id?: string, stateCode?: string | null, type?: string | null) {
    this.id = id ?? randomUUID();
    this.name = name;
    this.countryId = countryId;
    this.stateCode = stateCode ?? null;
    this.type = type ?? null;
  }

  readonly id!: string;
  readonly countryId!: string;
  readonly name!: string;
  readonly stateCode!: string | null;
  readonly type!: null | string;
}
