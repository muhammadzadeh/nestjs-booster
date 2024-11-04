import { IsNotEmpty, IsString } from 'class-validator';
import { RefreshTokenData } from '../../../application/services/jwt-token.service';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;

  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  toRefreshTokenData(): RefreshTokenData {
    return new RefreshTokenData(this.accessToken, this.refreshToken);
  }
}
