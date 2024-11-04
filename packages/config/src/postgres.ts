import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { ToBoolean } from '@repo/decorator';

class PostgresConfigExtra {
  readonly ssl = {
    rejectUnauthorized: false,
  };

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  readonly rejectUnauthorized?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly max?: number;

  readonly query_timeout = 3000;
}

export class PostgresConfig {
  readonly type = 'postgres';

  readonly schema = 'public';

  readonly retryAttempts = 2;

  readonly retryDelay = 2000;

  readonly maxQueryExecutionTime = 3000;

  readonly migrationsTableName = 'migration';

  readonly migrations = ['dist/migration/*.js'];

  readonly useUTC = true;

  @IsOptional()
  @IsString()
  @Type(() => String)
  @Transform(({ value }: { value: string }) => (value && process.env.NODE_ENV == 'test' ? `${value}_test` : value))
  readonly url?: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  @ValidateIf((o) => !o.url)
  readonly host?: string;

  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((o) => !o.url)
  readonly port?: number;

  @IsDefined()
  @IsString()
  @Type(() => String)
  @Transform(({ value }: { value: string }) => (process.env.NODE_ENV == 'test' ? `${value}_test` : value))
  @ValidateIf((o) => !o.url)
  readonly database?: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  @ValidateIf((o) => !o.url)
  readonly username?: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  @ValidateIf((o) => !o.url)
  readonly password?: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  readonly ssl?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => PostgresConfigExtra)
  readonly extra?: PostgresConfigExtra;
}
