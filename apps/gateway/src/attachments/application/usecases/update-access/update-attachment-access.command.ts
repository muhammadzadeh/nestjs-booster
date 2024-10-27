import { BaseCommand } from '@repo/types/commands/base.command';
import { UserId } from '@repo/types/common.types';

export interface GrantAttachmentAccess {
  readonly attachmentIds: string[];
  readonly userIds: UserId[];
}

export interface RevokeAttachmentAccess {
  readonly attachmentId: string;
  readonly userIds?: UserId[];
}

export class UpdateAttachmentAccessCommand extends BaseCommand {
  readonly grant?: GrantAttachmentAccess;
  readonly revoke?: RevokeAttachmentAccess;
}
