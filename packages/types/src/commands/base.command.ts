import { plainToInstance } from 'class-transformer';

export abstract class BaseCommand {
  static create<T extends BaseCommand>(this: new (...args: any[]) => T, data: T): T {
    const convertedObject = plainToInstance<T, any>(this, {
      ...data,
    });

    return convertedObject;
  }
}
