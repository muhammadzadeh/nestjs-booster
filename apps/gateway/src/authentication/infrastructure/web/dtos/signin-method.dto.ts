import { IsNotEmpty, IsString } from 'class-validator';
import { Email, Mobile } from '@repo/types/common.types';
import { IsNotUUID } from '@repo/validator/is-not-uuid.validator';
import { ToLowerCase } from '@repo/decorator';
import { IsIdentifier } from '@repo/validator/is-identifier.validator';

export class SigninMethodDto {
  @IsNotEmpty()
  @IsString()
  @IsNotUUID()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: Email | Mobile;
}
