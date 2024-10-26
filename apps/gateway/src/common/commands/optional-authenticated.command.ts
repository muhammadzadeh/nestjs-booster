import { UserId } from '@repo/types/common.types';
import { BaseCommand } from './base.command';

export abstract class OptionalAuthenticatedCommand extends BaseCommand {
  public readonly userId?: UserId;
}
