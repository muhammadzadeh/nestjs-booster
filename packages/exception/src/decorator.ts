import { applyDecorators, UseFilters } from '@nestjs/common';
import { GlobalExceptionFilter } from './global.filter';

export function MapException(
  exception: new (message?: string, options?: any) => Error,
  message: string
): MethodDecorator {
  return (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        throw new exception(message, { cause: error });
      }
    };

    return descriptor;
  };
}

export const UseGlobalFilters = (): ClassDecorator =>
  applyDecorators(UseFilters(GlobalExceptionFilter));
