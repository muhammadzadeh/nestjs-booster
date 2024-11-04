import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class VaultConfig {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  host!: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  token!: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  backend!: string;
}
