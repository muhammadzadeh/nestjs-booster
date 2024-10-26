/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { INestApplicationContext } from '@nestjs/common';
import { Transform } from 'class-transformer';

import { existsSync } from 'node:fs';
import { join } from 'path';

export type PromiseOr<T> = T | Promise<T>;
export type NonUndefined<T> = T extends undefined ? never : T;

function baseDirFinder(current: string): string {
  if (existsSync(join(current, 'node_modules'))) return current;
  return baseDirFinder(join(current, '../'));
}

const baseDir = baseDirFinder(__dirname);
export const pathFromBase = (...parts: string[]): string => join(baseDir, ...parts);
export const absoluteFromBase = (path: string): string => (path.startsWith('/') ? path : pathFromBase(path));
export const PathTransform = (): PropertyDecorator =>
  Transform(({ value }: { value: string }) => absoluteFromBase(value));

export interface Command {
  run: (app: INestApplicationContext) => Promise<void>;
}

/**
 *  https://www.postgresql.org/docs/current/errcodes-appendix.html
 * @param err any database error
 * @returns False if error represent the unique column is not unique.
 * otherwise True
 */
export function shouldRetryCreationTransaction(err: unknown) {
  const code = typeof err === 'object' ? String((err as any).code) : null;
  return code === '23505';
}

export function mergeObjects(oldData: any, newData: any): any {
  if (typeof oldData !== 'object' || typeof newData !== 'object') {
    return newData;
  }

  const merged = { ...oldData };

  for (const key in newData) {
    if (newData.hasOwnProperty(key)) {
      if (merged.hasOwnProperty(key)) {
        merged[key] = mergeObjects(merged[key], newData[key]);
      } else {
        merged[key] = newData[key] ?? merged[key];
      }
    }
  }

  return merged;
}

export function camelCaseObject<T>(obj: any): T {
  if (typeof obj !== 'object' || obj === undefined || obj === null) {
    return obj;
  }

  if (obj instanceof Array) {
    return obj.map((item) => camelCaseObject(item)) as T;
  }

  if (obj instanceof Date) {
    return obj as T;
  }

  const camelCased: any = {};

  for (const key in obj) {
    if (obj[key] || obj.hasOwnProperty(key)) {
      const camelCasedKey = key.replace(/_([a-z])/g, (g) => g[1]!.toUpperCase());
      camelCased[camelCasedKey] = camelCaseObject(obj[key]);
    }
  }

  return camelCased;
}

export function snackCaseObject<T>(obj: any): T {
  if (typeof obj !== 'object' || obj === undefined || obj === null) {
    return obj;
  }

  if (obj instanceof Array) {
    return obj.map((item) => snackCaseObject(item)) as T;
  }

  if (obj instanceof Date) {
    return obj as T;
  }

  const snackCased: any = {};

  for (const key in obj) {
    if (obj[key] || obj.hasOwnProperty(key)) {
      const snackCasedKey = key.replace(/([A-Z])/g, (g) => '_' + g.toLowerCase());
      snackCased[snackCasedKey] = snackCaseObject(obj[key]);
    }
  }

  return snackCased;
}
