import { IsBoolean, IsDefined, IsIn, IsNumber, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ToBoolean } from '@repo/decorator';

class MailerConfigSendGridAuth {
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly user!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly pass!: string;
}

export class MailerConfig<T = 'local' | 'mailgun' | 'sendgrid'> {
  readonly logger = true;

  @IsDefined()
  @IsString()
  @IsIn(['local', 'mailgun', 'sendgrid'])
  readonly provider!: T;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly host!: string;

  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((o) => o.provider != 'mailgun' && o.provider != 'local')
  readonly port!: number;

  @IsDefined()
  @IsBoolean()
  @ToBoolean()
  @ValidateIf((o) => o.provider != 'mailgun' && o.provider != 'local')
  readonly secure!: boolean;

  @IsDefined()
  @IsBoolean()
  @ToBoolean()
  @ValidateIf((o) => o.provider != 'mailgun' && o.provider != 'local')
  readonly requireTLS!: boolean;

  @IsDefined()
  @ValidateNested()
  @Type(() => MailerConfigSendGridAuth)
  readonly auth!: MailerConfigSendGridAuth;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly sender!: string;
}
