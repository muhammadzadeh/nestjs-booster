import { OptionalAuthenticatedCommand } from '@repo/types/commands/optional-authenticated.command';

export class DownloadCommand extends OptionalAuthenticatedCommand {
  readonly id!: string;
  readonly isShared?: boolean;
}
