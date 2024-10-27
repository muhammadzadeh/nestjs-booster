import { AuthenticatedCommand } from '@repo/types/commands/authenticated.command';

export class UpdateMyProfileCommand extends AuthenticatedCommand {
  readonly firstName!: string | null;
  readonly lastName!: string | null;
  readonly avatar!: string | null;
}
