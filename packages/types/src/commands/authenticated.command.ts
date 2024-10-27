import { UserId } from '../common.types';
import { BaseCommand } from './base.command';

export abstract class AuthenticatedCommand extends BaseCommand {
  public readonly userId!: UserId;
}
