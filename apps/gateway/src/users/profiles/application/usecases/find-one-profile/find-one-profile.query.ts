import { BaseCommand } from '../../../../../common/commands/base.command';
import { Email, Mobile, UserId, Username } from '@repo/types/common.types';

export class FindOneProfileQuery extends BaseCommand {
  readonly identifier!: Email | Username | Mobile | UserId;
}
