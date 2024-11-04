import {
  isArray,
  isString,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';
import { AttachmentsService } from '../../application/attachments.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPrivateAttachmentConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly attachmentService: AttachmentsService) {}

  async validate(value: any): Promise<boolean> {
    const attachmentIds: string[] = [];

    if (isString(value)) {
      attachmentIds.push(value);
    } else if (isArray(value)) {
      attachmentIds.push(...value);
    } else {
      return false;
    }

    const attachments = await this.attachmentService.findMany({
      attachmentIds: attachmentIds,
    });
    const isContainPublicAttachment =
      attachments.findIndex((attachment) => attachment.isPublic()) > -1;
    return (
      !isContainPublicAttachment && attachmentIds.length == attachments.length
    );
  }

  defaultMessage(): string {
    return 'Check Attachments, Some Attachments Not Private Or Missing From The Storage';
  }
}

export function IsPrivateAttachment(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPrivateAttachmentConstraint,
    });
  };
}
