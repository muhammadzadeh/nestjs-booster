import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StateEntity } from '../../domain/entities/state.entity';

export class StateResponse {
  static from(data: StateEntity): StateResponse {
    return {
      id: data.id,
      name: data.name,
    };
  }

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly id!: string;

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly name!: string;
}
