import { BaseCommand } from '@repo/types/commands/base.command';
import { UserId } from '@repo/types/common.types';
import { RevokeType } from '../../services/jwt-token.service';

export class RevokeTokenCommand extends BaseCommand {
  readonly userId!: UserId;
  readonly revokeType!: RevokeType;
}
