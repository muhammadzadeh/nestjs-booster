import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsStrongPassword } from '@repo/validator/is-strong-password.validator';

export class DefaultUserConfig {
  @IsNotEmpty()
  @IsEmail()
  @Type(() => String)
  readonly email!: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly mobile!: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  @Type(() => String)
  readonly password!: string;
}
