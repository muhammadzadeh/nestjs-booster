import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Token } from '../../../application/services';

export class AuthenticationResponse {
  static from(data: Token): AuthenticationResponse {
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expireAt: data.expireAt,
    };
  }

  @ApiProperty({
    type: String,
    name: 'access_token',
    description: 'The access token',
  })
  @Expose()
  @Type(() => String)
  accessToken!: string;

  @ApiProperty({
    type: String,
    name: 'refresh_token',
    description: 'The refresh token, using for generate new access token',
  })
  @Expose()
  @Type(() => String)
  refreshToken!: string;

  @ApiProperty({
    type: Date,
    name: 'expire_at',
    description: 'The access token expiration date',
  })
  @Expose()
  @Type(() => Date)
  expireAt!: Date;
}
