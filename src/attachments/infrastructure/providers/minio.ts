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
import { Readable } from 'stream';
import { ExceptionMapper } from '../../../common/exception';
import {
  StorageIsUnavailableException,
  StorageProvider,
  StorageProviderOptions,
  UploadData,
} from '../../application/storage-provider';

@Injectable()
export class MinioStorageProvider implements StorageProvider {
  private readonly privateBucketName: string;
  private readonly publicBucketName: string;

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
    this.privateBucketName = options.privateBucketName;
    this.publicBucketName = options.publicBucketName;

    this.setup();
  }
  async setup(): Promise<void> {
    const isPrivateBucketExists = await this.isBucketExists(this.privateBucketName);
    if (!isPrivateBucketExists) {
      await this.s3Client.send(
        new CreateBucketCommand({
          Bucket: this.privateBucketName,
          ACL: 'private',
        }),
      );
    }

    const isPublicBucketExists = await this.isBucketExists(this.publicBucketName);
    if (!isPublicBucketExists) {
      await this.s3Client.send(
        new CreateBucketCommand({
          Bucket: this.publicBucketName,
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
            Resource: [`arn:aws:s3:::${this.publicBucketName}`],
          },
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.publicBucketName}/*`],
          },
        ],
      };

      await this.s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: this.publicBucketName,
          Policy: JSON.stringify(policy),
        }),
      );
    }
  }

  getName(): string {
    return 'minio';
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not upload!')
  async upload(input: UploadData): Promise<void> {
    const { bucket, key } = this.getBucketAndKey(input.path);
    const uploadParams: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: input.data,
      ContentType: input.mimeType.mime,
    };

    await this.s3Client.send(new PutObjectCommand(uploadParams));
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not download!')
  async download(path: string): Promise<Buffer> {
    const { bucket, key } = this.getBucketAndKey(path);
    const downloadParams: GetObjectCommandInput = {
      Bucket: bucket,
      Key: key,
    };

    const response = await this.s3Client.send(new GetObjectCommand(downloadParams));

    return await this.streamToBuffer(response.Body as Readable);
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not delete!')
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
    return { bucket: parts[0], key: parts.slice(1).join('/') };
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
}