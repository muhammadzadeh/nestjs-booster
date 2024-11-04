import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StateEntity } from '../../../domain/entities/state.entity';
import { TypeormCityEntity } from './typeorm-city.entity';
import { TypeormCountryEntity } from './typeorm-country.entity';

@Entity({
  name: 'states',
})
export class TypeormStateEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'states_id_pkey' })
  readonly id!: string;

  @Column({ type: 'uuid', name: 'country_id' })
  readonly countryId!: string;

  @Column({ type: 'varchar' })
  readonly name!: string;

  @Column({ type: 'varchar', name: 'state_code' })
  readonly stateCode!: string | null;

  @Column({ type: 'varchar', nullable: true })
  readonly type!: null | string;

  @Column({ type: 'timestamptz', name: 'created_at', default: 'now()' })
  readonly createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: 'now()' })
  readonly updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  @ManyToOne(() => TypeormCountryEntity, (country) => country.states, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'states_country_id_countries_id_fkey',
    name: 'country_id',
  })
  readonly country!: TypeormCountryEntity | null;

  @OneToMany(() => TypeormCityEntity, (city) => city.state)
  readonly cities!: TypeormCityEntity[] | null;

  static toStateEntity(item: TypeormStateEntity): StateEntity {
    return new StateEntity(item.countryId, item.name, item.id, item.stateCode, item.type);
  }
}
