import { BaseCommand } from "@repo/types/commands/base.command";

export class RefreshTokenCommand extends BaseCommand{
  readonly refreshToken!: string;
  readonly accessToken!: string;
}