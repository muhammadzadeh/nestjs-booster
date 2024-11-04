import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Duration } from 'luxon';

export class TokenConfig {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly jwtSecret!: string;

  @IsOptional()
  @Transform(({ value }) => Duration.fromISO(value ?? 'PT2H'))
  @Type(() => String)
  readonly accessTokenExpiration!: Duration;

  @IsOptional()
  @Transform(({ value }) => Duration.fromISO(value ?? 'P3D'))
  @Type(() => String)
  readonly refreshTokenExpiration!: Duration;
}

export class GoogleConfig {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly clientId!: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly clientSecret!: string;
}

export class AuthenticationProviderConfig {
  @IsOptional()
  @ValidateNested()
  @Type(() => GoogleConfig)
  readonly google?: GoogleConfig;
}

export class AuthenticationConfig {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly passwordRegEx!: string;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  readonly allowRegisterNewUser!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  readonly registerUserOnSendOtp!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  readonly allowUnverifiedSignin!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  readonly allowImpersonation!: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TokenConfig)
  readonly token!: TokenConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AuthenticationProviderConfig)
  readonly providers!: AuthenticationProviderConfig;
}
