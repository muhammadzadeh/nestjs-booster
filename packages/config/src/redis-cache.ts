import { IsDefined, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class RedisConfig {
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly url!: string;

  @ValidateIf((o) => !o.url)
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly host!: string;

  @ValidateIf((o) => !o.url)
  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  readonly port!: number;

  @ValidateIf((o) => !o.url)
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly username?: string;

  @ValidateIf((o) => !o.url)
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly password?: string;

  @ValidateIf((o) => !o.url)
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly db?: number = 0;
}
