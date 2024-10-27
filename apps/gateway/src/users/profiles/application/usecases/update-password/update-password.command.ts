import { AuthenticatedCommand } from '@repo/types/commands/authenticated.command';

export class UpdatePasswordCommand extends AuthenticatedCommand {
  readonly password!: string;
}
