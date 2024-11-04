import { HttpStatus, Injectable } from '@nestjs/common';
import { Configuration, TokenConfig } from '@repo/config';
import { BaseHttpException } from '@repo/exception/base.exception';
import { ErrorCode } from '@repo/types/error-code.enum';
import { randomUUID } from 'crypto';
import { JwtPayload, decode, sign, verify } from 'jsonwebtoken';
import { DateTime, Duration } from 'luxon';
import { CacheService } from '../../../common/cache/services';
import { randomStringAsync } from '@repo/utils/string';
import { Email, Mobile, UserId } from '@repo/types/common.types';
import { Permission } from '../../../users/roles/domain/entities/role.entity';

@Injectable()
export class JwtTokenService {
  private readonly tokenConfig: TokenConfig;
  constructor(
    private readonly cacheService: CacheService,
    readonly config: Configuration,
  ) {
    this.tokenConfig = config.authentication.token;
  }

  async generate(payload: TokenPayload): Promise<Token>;
  async generate(payload: TokenPayload, options: TokenOption): Promise<Token>;
  async generate(payload: TokenPayload, options?: TokenOption): Promise<Token> {
    const id = randomUUID();
    const accessTokenExpiration = options?.ttl?.as('second') ?? this.tokenConfig.accessTokenExpiration.as('second');
    const accessToken = sign({ ...payload }, this.tokenConfig.jwtSecret, {
      expiresIn: accessTokenExpiration,
      jwtid: id,
    });

    const refreshTokenExpiration = this.tokenConfig.refreshTokenExpiration.as('second');
    const refreshToken = await randomStringAsync({ length: 200, type: 'base64' });

    await this.cacheService
      .getRedisClient()
      .setex(this.generateRedisRefreshKey(payload.userId, id), refreshTokenExpiration, refreshToken);

    await this.cacheService
      .getRedisClient()
      .setex(this.generateRedisAccessKey(payload.userId, id), accessTokenExpiration, id);

    const expireAt = DateTime.local().plus(this.tokenConfig.accessTokenExpiration).toJSDate();
    return {
      accessToken,
      refreshToken,
      expireAt,
    };
  }

  async refresh(input: RefreshTokenData): Promise<Token> {
    const accessTokenPayload = decode(input.accessToken) as JwtPayload;

    if (!accessTokenPayload || !accessTokenPayload.jti) {
      throw new InvalidTokenException(`Invalid Access Token!, jti is missing!`);
    }

    let isRefreshTokenExists: string | null;
    try {
      isRefreshTokenExists = await this.cacheService
        .getRedisClient()
        .get(this.generateRedisRefreshKey(accessTokenPayload.userId, accessTokenPayload.jti));
    } catch (error) {
      throw new InvalidTokenException(`Failed to refresh token!`, { cause: error });
    }

    if (!isRefreshTokenExists) {
      throw new InvalidTokenException(`The Refresh Token was Expired!`);
    }

    if (input.refreshToken !== isRefreshTokenExists) {
      throw new InvalidTokenException(`The Refresh Token does not match!`);
    }

    const token = await this.generate({
      userId: accessTokenPayload.userId,
      email: accessTokenPayload.email,
      mobile: accessTokenPayload.mobile,
      isEmailVerified: accessTokenPayload.isEmailVerified,
      isMobileVerified: accessTokenPayload.isMobileVerified,
      accessType: accessTokenPayload.accessType,
      isBlocked: accessTokenPayload.isBlocked,
      meta: accessTokenPayload.meta,
      permissions: accessTokenPayload.permissions,
    });
    try {
      await this.revokeRefreshToken(accessTokenPayload.userId, accessTokenPayload.jti);
      await this.revokeAccessToken(accessTokenPayload.userId, accessTokenPayload.jti);
    } catch (error) {
      throw new InvalidTokenException(`Failed to refresh token!`, { cause: error });
    }

    return token;
  }

  async verify(token: string): Promise<TokenPayload> {
    let payload: JwtPayload;

    try {
      payload = verify(token, this.tokenConfig.jwtSecret) as JwtPayload;

      const accessTokenId = await this.cacheService
        .getRedisClient()
        .get(this.generateRedisAccessKey(payload.userId, payload.jti!));
      if (!accessTokenId) {
        throw new TokenVerificationException(`The Access Token is revoked.${accessTokenId}`);
      }
    } catch (error) {
      throw new TokenVerificationException(`Failed to verify the given token: ${token}`, { cause: error });
    }

    return payload as TokenPayload;
  }

  async revokeToken(options: RevokeTokenOption): Promise<void> {
    if (options.revokeType === RevokeType.ACCESS_TOKEN) {
      await this.revokeAccessTokens(options.userId);
    } else if (options.revokeType === RevokeType.REFRESH_TOKEN) {
      await this.revokeRefreshTokens(options.userId);
    } else if (options.revokeType === RevokeType.BOTH) {
      await this.revokeAccessTokens(options.userId);
      await this.revokeRefreshTokens(options.userId);
    }
  }

  private async revokeAccessTokens(userId: UserId): Promise<void> {
    const accessTokenIds = await this.getAllTokenIds(`jwt:${userId}:access:*`);
    if (!accessTokenIds.length) {
      return;
    }

    await this.cacheService.getRedisClient().del(accessTokenIds);
  }

  private async revokeAccessToken(userId: UserId, accessTokenId: string): Promise<void> {
    await this.cacheService.getRedisClient().del(this.generateRedisAccessKey(userId, accessTokenId));
  }

  private async revokeRefreshToken(userId: UserId, accessTokenId: string): Promise<void> {
    await this.cacheService.getRedisClient().del(this.generateRedisRefreshKey(userId, accessTokenId));
  }

  private async revokeRefreshTokens(userId: UserId): Promise<void> {
    const refreshTokenIds = await this.getAllTokenIds(`jwt:${userId}:refresh:*`);
    if (!refreshTokenIds.length) {
      return;
    }

    await this.cacheService.getRedisClient().del(refreshTokenIds);
  }

  private async getAllTokenIds(match: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const stream = this.cacheService.getRedisClient().scanStream({
        match: match,
        count: 10,
      });

      let tokenIds: string[] = [];
      stream.on('data', function (resultKeys) {
        tokenIds.push(...resultKeys);
      });

      stream.on('end', function () {
        resolve(tokenIds);
      });

      stream.on('error', function (err) {
        reject(err);
      });
    });
  }

  private generateRedisRefreshKey(userId: UserId, tokenId: string): string {
    return `jwt:${userId}:refresh:${tokenId}`;
  }

  private generateRedisAccessKey(userId: UserId, tokenId: string): string {
    return `jwt:${userId}:access:${tokenId}`;
  }
}

export class InvalidTokenException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.BAD_REQUEST;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.INVALID_TOKEN;
}

export class TokenVerificationException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.UNAUTHORIZED;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.UNVERIFIED_TOKEN;
}

export class Token {
  accessToken!: string;
  refreshToken!: string;
  expireAt!: Date;
}

export class RefreshTokenData {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: string,
  ) {}
}

export enum AccessType {
  ADMIN = 'admin',
  VERIFIED_USER = 'verified_user',
  UNVERIFIED_USER = 'unverified_user',
  ANONYMOUS = 'anonymous',
}

export class TokenPayloadMeta {
  [key: string]: any;
}

export class TokenPayload {
  readonly userId!: UserId;
  readonly email!: Email | null;
  readonly mobile!: Mobile | null;
  readonly isEmailVerified!: boolean;
  readonly isMobileVerified!: boolean;
  readonly accessType!: AccessType;
  readonly isBlocked!: boolean;
  readonly meta?: TokenPayloadMeta;
  readonly permissions?: Permission[];
}

export class TokenOption {
  ttl?: Duration;
}

export enum RevokeType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  BOTH = 'both',
}

export class RevokeTokenOption {
  readonly userId!: UserId;
  readonly revokeType!: RevokeType;
}
