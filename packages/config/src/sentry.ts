import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from '@repo/decorator';

export class SentryConfig {
  readonly defaultIntegrations = false;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly dsn!: string;

  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  readonly tracesSampleRate!: number;

  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  readonly profilesSampleRate!: number;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  readonly enabled!: boolean;
}
