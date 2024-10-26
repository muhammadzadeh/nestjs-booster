import { BaseCommand } from '../../../../common/commands/base.command';
import { Email, Mobile, UserId, Username } from '@repo/types/common.types';

export class ImpersonationCommand extends BaseCommand {
  readonly identifier!: Email | Mobile | UserId | Username;
}
