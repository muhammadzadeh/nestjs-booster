import { BaseCommand } from '@repo/types/commands/base.command';
import { Email, Mobile } from '@repo/types/common.types';

export class RequestResetPasswordCommand extends BaseCommand {
  readonly identifier!: Email | Mobile;
}
