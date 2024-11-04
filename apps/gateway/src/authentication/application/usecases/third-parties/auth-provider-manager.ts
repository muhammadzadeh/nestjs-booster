import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseHttpException } from '@repo/exception/base.exception';
import { ErrorCode } from '@repo/types/error-code.enum';
import { Auth, AuthProvider, AuthProviderType, AuthUser } from './auth-provider';

@Injectable()
export class AuthProviderManager {
  constructor(private readonly authProviders: AuthProvider[]) {}

  async authenticate(auth: Auth, provider: AuthProviderType): Promise<AuthUser> {
    const authProvider = this.findProvider(auth, provider);
    return authProvider.authenticate(auth);
  }

  private findProvider(auth: Auth, type: AuthProviderType): AuthProvider {
    const authProvider = this.authProviders.find((provider) => provider.isSupport(type));

    if (!authProvider) {
      throw new InvalidAuthenticationMethodException(`Could not find auth provider ${auth.constructor.name}`);
    }

    return authProvider;
  }
}

export class InvalidAuthenticationMethodException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.NOT_FOUND;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.INVALID_AUTHENTICATION_METHOD;
}
