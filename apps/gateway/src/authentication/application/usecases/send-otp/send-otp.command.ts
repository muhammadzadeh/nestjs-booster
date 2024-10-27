import { BaseCommand } from '@repo/types/commands/base.command';
import { Email, Mobile } from '@repo/types/common.types';
import { OTPType } from '../../../domain/entities';

export class SendOtpCommand extends BaseCommand {
  readonly identifier!: Email | Mobile;
  readonly type!: OTPType;
}
