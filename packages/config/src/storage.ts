import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsNumber, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { PathTransform } from '@repo/utils';

class StorageConfigLocal {
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly privateDir!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly publicDir!: string;

  @IsDefined()
  @IsString()
  @PathTransform()
  @Type(() => String)
  readonly uploadDir!: string;


  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly privateBaseUrl!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly publicBaseUrl!: string;
}

class StorageConfigMinio {
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly privateBucket!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly publicBucket!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly accessKeyId!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly secretAccessKey!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly storageEndpoint!: string;
  
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly privateBaseUrl!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly publicBaseUrl!: string;
}

class StorageConfigR2 {
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly privateBucket!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly publicBucket!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly accessKeyId!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly secretAccessKey!: string;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly storageEndpoint!: string;
}

export class StorageConfig<T = 'local' | 'minio' | 'r2'> {
  @IsDefined()
  @ValidateNested()
  @Type(() => StorageConfigLocal)
  @ValidateIf((o) => o.type == 'local')
  readonly local!: T extends 'local' ? StorageConfigLocal : undefined;

  @IsDefined()
  @ValidateNested()
  @Type(() => StorageConfigMinio)
  @ValidateIf((o) => o.type == 'minio')
  readonly minio!: T extends 'minio' ? StorageConfigMinio : undefined;

  @IsDefined()
  @ValidateNested()
  @Type(() => StorageConfigR2)
  @ValidateIf((o) => o.type == 'r2')
  readonly r2!: T extends 'r2' ? StorageConfigR2 : undefined;

  @IsDefined()
  @IsString()
  @IsIn(['local', 'minio', 'r2'])
  readonly type!: T;

  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  readonly maxFileSize!: number;
}
