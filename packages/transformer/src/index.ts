import { ClassConstructor, plainToInstance, Transform } from 'class-transformer';
import { escape } from 'lodash';
import slugify from 'slugify';

export const EscapeHtml = <T>({ value }: { value: T }): string | T =>
  typeof value == 'string' ? escape(value).trim() : value;

export const SanitizeHTML = <T>({ value }: { value: T }): string | T =>
  typeof value == 'string' ? value.replace(/<[^>]*>/g, '').trim() : value;

export const StringToNumber = <T>({ value }: { value: T }): number => (typeof value == 'string' ? Number(value) : 0);

const stringBooleanMap = new Map([
  ['true', true],
  ['false', false],
]);
export const StringBoolean = <T>({ value }: { value: T }): boolean | T =>
  typeof value == 'string' ? (stringBooleanMap.get(value) ?? value) : value;

export const StringSlugify = <T>({ value }: { value: T }): string | T =>
  typeof value == 'string' ? slugify(value, { lower: true }) : value;

export const TransformRecordToMap = (cls: ClassConstructor<unknown>): PropertyDecorator =>
  Transform(({ value }) => Object.keys(value).reduce((t, c) => t.set(c, plainToInstance(cls, value[c])), new Map()));

export const TransformToInt = Transform(({ value }) => (typeof value == 'number' ? +value.toFixed(0) : value));
