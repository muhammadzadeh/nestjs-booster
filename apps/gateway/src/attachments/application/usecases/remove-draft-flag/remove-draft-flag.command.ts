import { BaseCommand } from "@repo/types/commands/base.command";

export class RemoveAttachmentDraftFlagCommand extends BaseCommand {
  readonly attachmentIds!: string[];
}
