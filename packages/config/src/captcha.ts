import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsString, ValidateNested } from 'class-validator';
import { ToBoolean } from '@repo/decorator';

export class RecaptchaConfig {
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly secret?: string;
}

export class CaptchaConfig<T = 'recaptcha' | 'hcaptcha'> {
  @IsDefined()
  @ToBoolean()
  @Type(() => Boolean)
  readonly enabled!: boolean;

  @IsDefined()
  @IsString()
  @IsIn(['recaptcha', 'hcaptcha'])
  readonly provider!: T;

  @IsDefined()
  @ValidateNested()
  @Type(() => RecaptchaConfig)
  readonly recaptcha!: RecaptchaConfig;
}
