import { Type } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';

export class ThrottlingConfig {
  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  limit!: number;

  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  ttl!: number;
}
