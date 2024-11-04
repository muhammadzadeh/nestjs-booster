import {
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { MapException } from '@repo/decorator/function-decorator';
import { Readable } from 'stream';
import {
  StorageIsUnavailableException,
  StorageProvider,
  StorageProviderOptions,
  UploadData,
} from '../../application/storage-provider';

@Injectable()
export class MinioStorageProvider implements StorageProvider {
  private readonly s3Client: S3Client;

  constructor(readonly options: MinioOptions) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: options.endpoint,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
      forcePathStyle: true,
    });

    this.setup();
  }
  async setup(): Promise<void> {
    const isPrivateBucketExists = await this.isBucketExists(this.options.privateBucketName);
    if (!isPrivateBucketExists) {
      await this.s3Client.send(
        new CreateBucketCommand({
          Bucket: this.options.privateBucketName,
          ACL: 'private',
        }),
      );
    }

    const isPublicBucketExists = await this.isBucketExists(this.options.publicBucketName);
    if (!isPublicBucketExists) {
      await this.s3Client.send(
        new CreateBucketCommand({
          Bucket: this.options.publicBucketName,
          ACL: 'public-read',
        }),
      );

      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetBucketLocation', 's3:ListBucket'],
            Resource: [`arn:aws:s3:::${this.options.publicBucketName}`],
          },
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.options.publicBucketName}/*`],
          },
        ],
      };

      await this.s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: this.options.publicBucketName,
          Policy: JSON.stringify(policy),
        }),
      );
    }
  }

  getPrivateBaseUrl(): string {
    return this.options.privateBaseUrl;
  }

  getPublicBaseUrl(): string {
    return this.options.publicBaseUrl;
  }

  getPrivateBucketName(): string {
    return this.options.privateBucketName;
  }

  getPublicBucketName(): string {
    return this.options.publicBucketName;
  }

  getName(): string {
    return 'minio';
  }

  @MapException(StorageIsUnavailableException, 'Could not upload!')
  async upload(input: UploadData): Promise<void> {
    const { bucket, key } = this.getBucketAndKey(input.path);
    const buffered = await this.streamToBuffer(input.fileData as Readable);

    const uploadParams: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: buffered,
      ContentType: input.mimeType.mime,
      ContentLength: buffered.byteLength,
    };

    await this.s3Client.send(new PutObjectCommand(uploadParams));
  }

  @MapException(StorageIsUnavailableException, 'Could not download!')
  async download(path: string): Promise<Buffer> {
    const { bucket, key } = this.getBucketAndKey(path);
    const downloadParams: GetObjectCommandInput = {
      Bucket: bucket,
      Key: key,
    };

    const response = await this.s3Client.send(new GetObjectCommand(downloadParams));

    return await this.streamToBuffer(response.Body as Readable);
  }

  @MapException(StorageIsUnavailableException, 'Could not delete!')
  async delete(path: string): Promise<void> {
    const { bucket, key } = this.getBucketAndKey(path);
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: bucket,
      Key: key,
    };

    await this.s3Client.send(new DeleteObjectCommand(deleteParams));
  }

  private getBucketAndKey(path: string): { bucket: string; key: string } {
    const parts = path.split('/');
    return { bucket: parts[0]!, key: parts.slice(1).join('/') };
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  private async isBucketExists(bucketName: string): Promise<boolean> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }
}

export interface MinioOptions extends StorageProviderOptions {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  privateBucketName: string;
  publicBucketName: string;
  privateBaseUrl: string;
  publicBaseUrl: string;
}
