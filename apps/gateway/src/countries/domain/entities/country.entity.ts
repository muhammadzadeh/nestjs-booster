export class Timezone {
  zoneName!: string;
  gmtOffset!: number;
  gmtOffsetName!: string;
  abbreviation!: string;
  tzName!: string;
}

export class Translations {
  [key: string]: string;
}

export class CountryEntity {
  constructor(
    id: string,
    name: string,
    iso3: string,
    iso2: string,
    numericCode: string,
    phoneCode: string,
    currency: string,
    currencyName: string,
    currencySymbol: string,
    native: string | null,
    region: string,
    subregion: string,
    nationality: string,
    timezones: Timezone[],
    translations: Translations,
    emoji: string,
    emojiU: string,
  ) {
    this.id = id;
    this.name = name;
    this.iso3 = iso3;
    this.iso2 = iso2;
    this.numericCode = numericCode;
    this.phoneCode = phoneCode;
    this.currency = currency;
    this.currencyName = currencyName;
    this.currencySymbol = currencySymbol;
    this.native = native;
    this.region = region;
    this.subregion = subregion;
    this.nationality = nationality;
    this.timezones = timezones;
    this.translations = translations;
    this.emoji = emoji;
    this.emojiU = emojiU;
  }

  readonly id!: string;
  readonly name!: string;
  readonly iso3!: string;
  readonly iso2!: string;
  readonly numericCode!: string;
  readonly phoneCode!: string;
  readonly currency!: string;
  readonly currencyName!: string;
  readonly currencySymbol!: string;
  readonly native!: string | null;
  readonly region!: string;
  readonly subregion!: string;
  readonly nationality!: string;
  readonly timezones!: Timezone[];
  readonly translations!: Translations;
  readonly emoji!: string;
  readonly emojiU!: string;
}
