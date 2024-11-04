import { Injectable } from '@nestjs/common';
import { MapException } from '@repo/decorator/function-decorator';
import fs from 'node:fs/promises';
import {
  StorageIsUnavailableException,
  StorageProvider,
  StorageProviderOptions,
  UploadData,
} from '../../application/storage-provider';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  constructor(readonly options: LocalOptions) {
    this.setup();
  }

  async setup(): Promise<void> {
    await fs.mkdir(`${this.options.localStoragePath}/${this.options.privateDir}`, {
      recursive: true,
    });
    await fs.mkdir(`${this.options.localStoragePath}/${this.options.publicDir}`, {
      recursive: true,
    });
  }

  getName(): string {
    return 'local';
  }

  getPrivateBaseUrl(): string {
    return this.options.privateBaseUrl;
  }

  getPublicBaseUrl(): string {
    return this.options.publicBaseUrl;
  }

  getPrivateBucketName(): string {
    return this.options.privateDir;
  }

  getPublicBucketName(): string {
    return this.options.publicDir;
  }

  @MapException(StorageIsUnavailableException, 'Could not upload!')
  async upload(input: UploadData): Promise<void> {
    await fs.mkdir(`${this.options.localStoragePath}/${input.path}`, {
      recursive: true,
    });
    await fs.writeFile(`${this.options.localStoragePath}/${input.path}`, input.fileData as Buffer);
  }

  @MapException(StorageIsUnavailableException, 'Could not download!')
  download(path: string): Promise<Buffer> {
    return fs.readFile(`${this.options.localStoragePath}/${path}`);
  }

  @MapException(StorageIsUnavailableException, 'Could not delete!')
  async delete(path: string): Promise<void> {
    const files = await fs.readdir(`${this.options.localStoragePath}/${path}`);
    await Promise.all(files.filter((f) => f.includes(path)).map((f) => fs.rm(f)));
  }
}

export interface LocalOptions extends StorageProviderOptions {
  localStoragePath: string;
  privateDir: string;
  publicDir: string;
  privateBaseUrl: string;
  publicBaseUrl: string;
}
