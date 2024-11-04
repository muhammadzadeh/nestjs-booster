import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Token } from '../../../application/services/jwt-token.service';

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
    description: 'The access token',
  })
  @Type(() => String)
  accessToken!: string;

  @ApiProperty({
    type: String,
    description: 'The refresh token, using for generate new access token',
  })
  @Type(() => String)
  refreshToken!: string;

  @ApiProperty({
    type: Date,
    description: 'The access token expiration date',
  })
  @Type(() => Date)
  expireAt!: Date;
}
