import { ServiceUnavailableException } from '@nestjs/common';
import { Readable } from 'typeorm/platform/PlatformTools.js';

export const STORAGE_PROVIDER_TOKEN = Symbol('StorageProvider');
export interface StorageProvider {
  getPrivateBaseUrl(): string;
  getPublicBaseUrl(): string;
  upload(input: UploadData): Promise<void>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getName(): string;
  setup(): Promise<void>;
  getPrivateBucketName(): string;
  getPublicBucketName(): string;
}

export class UploadData {
  readonly path!: string;
  readonly mimeType!: ExtendedMemeType;
  readonly fileData!: Readable | Buffer;
}

export type ExtendedMemeType = {
  readonly ext: string;
  readonly mime: string;
};

export interface FileInfo {
  fileData: Readable | Buffer;
  mimeType: ExtendedMemeType;
  originalName: string;
}

export interface StorageProviderOptions {}

export class StorageIsUnavailableException extends ServiceUnavailableException {}
