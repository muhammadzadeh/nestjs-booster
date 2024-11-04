import { BaseCommand } from '@repo/types/commands/base.command';
import { Email, Mobile } from '@repo/types/common.types';

export class SigninByPasswordCommand extends BaseCommand {
  readonly identifier!: Email | Mobile;
  readonly password!: string;
}
