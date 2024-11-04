import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AppConfigs {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  env!: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  url?: string;
}
