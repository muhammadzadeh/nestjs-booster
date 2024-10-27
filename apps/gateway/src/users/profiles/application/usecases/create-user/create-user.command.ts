import { BaseCommand } from '@repo/types/commands/base.command';
import { Email, Mobile } from '@repo/types/common.types';

export class CreateUserCommand extends BaseCommand {
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly email?: Email | null;
  readonly mobile?: Mobile | null;
  readonly avatar?: string | null;
  readonly password?: string | null;
  readonly isEmailVerified?: boolean;
  readonly isMobileVerified?: boolean;
}
