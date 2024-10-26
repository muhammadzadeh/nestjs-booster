import { BaseCommand } from '../../../../common/commands/base.command';
import { Email, Mobile } from '@repo/types/common.types';
import { OTPType } from '../../../domain/entities';

export class VerifyCommand extends BaseCommand {
  otp!: string;
  type!: OTPType;
  identifier!: Email | Mobile;
}
