import {
  isUUID,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsNotUUIDConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return !isUUID(value, '4');
  }

  defaultMessage(): string {
    return 'UUID is not allowed';
  }
}

export function IsNotUUID(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotUUIDConstraint,
    });
  };
}
