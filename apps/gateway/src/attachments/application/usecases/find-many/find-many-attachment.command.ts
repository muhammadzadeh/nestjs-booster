import { BaseCommand } from "@repo/types/commands/base.command";

export class FindManyAttachmentCommand extends BaseCommand {
  readonly attachmentIds!: string[];
}
