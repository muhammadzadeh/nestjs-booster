import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CountryEntity, Timezone, Translations } from '../../../domain/entities/country.entity';
import { TypeormStateEntity } from './typeorm-state.entity';

@Entity({
  name: 'countries',
})
export class TypeormCountryEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'countries_id_pkey' })
  readonly id!: string;

  @Column({ type: 'varchar' })
  readonly name!: string;

  @Column({ type: 'character', length: 3 })
  readonly iso3!: string;

  @Column({ type: 'character', length: 2 })
  readonly iso2!: string;

  @Column({ type: 'character', length: 3, name: 'numeric_code' })
  readonly numericCode!: string;

  @Column({ type: 'varchar', name: 'phone_code' })
  readonly phoneCode!: string;

  @Column({ type: 'varchar' })
  readonly currency!: string;

  @Column({ type: 'varchar', name: 'currency_name' })
  readonly currencyName!: string;

  @Column({ type: 'varchar', name: 'currency_symbol' })
  readonly currencySymbol!: string;

  @Column({ type: 'varchar', nullable: true })
  readonly native!: string | null;

  @Column({ type: 'varchar' })
  readonly region!: string;

  @Column({ type: 'varchar', name: 'subregion' })
  readonly subregion!: string;

  @Column({ type: 'varchar' })
  readonly nationality!: string;

  @Column({ type: 'jsonb', nullable: true })
  readonly timezones!: Timezone[] | null;

  @Column({ type: 'jsonb' })
  readonly translations!: Translations;

  @Column({ type: 'varchar' })
  readonly emoji!: string;

  @Column({ type: 'varchar' })
  readonly emojiU!: string;

  @Column({ type: 'timestamptz', name: 'created_at', default: 'now()' })
  readonly createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: 'now()' })
  readonly updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  @OneToMany(() => TypeormStateEntity, (state) => state.country)
  readonly states!: TypeormStateEntity[] | null;

  static toCountryEntity(item: TypeormCountryEntity): CountryEntity {
    return new CountryEntity(
      item.id,
      item.name,
      item.iso3,
      item.iso2,
      item.numericCode,
      item.phoneCode,
      item.currency,
      item.currencyName,
      item.currencySymbol,
      item.native,
      item.region,
      item.subregion,
      item.nationality,
      item.timezones ?? [],
      item.translations,
      item.emoji,
      item.emojiU,
    );
  }
}
