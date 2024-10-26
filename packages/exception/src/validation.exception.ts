import { ValidationError as CommonValidationError } from '@nestjs/common';
import { ValidationError as ClassValidationError } from 'class-validator';

type ValidationError = ClassValidationError | CommonValidationError;

export class ValidationException extends Error {
  constructor(public errors: FlatError[]) {
    super();
  }

  getFlatErrors(): FlatError[] {
    return this.errors;
  }

  static fromErrors(errors: ValidationError[]): ValidationException {
    return new ValidationException(this.reduceErrors(errors));
  }

  private static extract(e: ValidationError, parent: string[]): Errors[] {
    return Object.keys(e.constraints!).map((validation: string) => ({
      message: e.constraints![validation]!,
      field: [...parent, e.property],
      validation: validation,
    }));
  }

  private static flattenErrors(errors: ValidationError[], parent: string[]): Errors[] {
    return errors
      .map((e) =>
        e.constraints === undefined
          ? this.flattenErrors(e.children ?? [], [...parent, e.property])
          : this.extract(e, parent),
      )
      .reduce((t, i) => t.concat(i), []);
  }

  private static reduceErrors(e: ValidationError[]): FlatError[] {
    return this.flattenErrors(e, []).map((i) => ({
      ...i,
      field: i.field.join('.'),
    }));
  }
}

export interface FlatError {
  message: string;
  field: string;
  validation: string;
}

interface Errors {
  message: string;
  field: string[];
  validation: string;
}