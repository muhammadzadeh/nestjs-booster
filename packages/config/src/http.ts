import { IsDefined, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class HttpConfig {
  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  readonly port!: number;
}
