import { BaseCommand } from "@repo/types/commands/base.command";

export class DeleteAttachmentCommand extends BaseCommand {
  readonly attachmentId!: string;
}
