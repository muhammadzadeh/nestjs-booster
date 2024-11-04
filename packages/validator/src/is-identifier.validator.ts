import {
  isEmail,
  isPhoneNumber,
  isUUID,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsIdentifierConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return isEmail(value) || isPhoneNumber(value) || isUUID(value);
  }

  defaultMessage(): string {
    return 'Its not valid identifier, mobile or email';
  }
}

export function IsIdentifier(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIdentifierConstraint,
    });
  };
}
