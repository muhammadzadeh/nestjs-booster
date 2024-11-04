import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsString, ValidateIf, ValidateNested } from 'class-validator';

export class KavenegarConfig {
  @IsDefined()
  @IsString()
  readonly apiKey!: string;
}

export class SmsSenderConfig<T = 'local' | 'kavenegar'> {
  @IsDefined()
  @IsString()
  @IsIn(['local', 'kavenegar'])
  readonly provider!: T;

  @IsDefined()
  @ValidateNested()
  @ValidateIf((obj) => obj.provider == 'kavenegar')
  @Type(() => KavenegarConfig)
  readonly kavenegar!: KavenegarConfig;
}
