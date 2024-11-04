import { Injectable } from '@nestjs/common';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { Configuration } from '@repo/config';
import { InvalidCredentialException } from '../../../application/exceptions';
import {
  Auth,
  AuthProvider,
  AuthProviderType,
  AuthUser,
} from '../../../application/usecases/third-parties/auth-provider';

@Injectable()
export class GoogleAuthProvider implements AuthProvider {
  constructor(private readonly configuration: Configuration) {}

  async authenticate({ token }: Auth): Promise<AuthUser> {
    const ticket = await this.verifyToken(token);
    const payload = ticket.getPayload();

    if (!payload) {
      throw new InvalidCredentialException('Illegal state, given payload is null');
    }

    return new AuthUser(
      payload.sub,
      AuthProviderType.GOOGLE,
      payload.email!,
      payload.given_name ?? null,
      payload.family_name ?? null,
      payload.picture ?? null,
    );
  }

  isSupport(type: AuthProviderType): boolean {
    return type == this.getName();
  }

  getName(): AuthProviderType {
    return AuthProviderType.GOOGLE;
  }

  private async verifyToken(token: string): Promise<LoginTicket> {
    try {
      const googleConfig = this.configuration.authentication.providers.google;
      if (!googleConfig) {
        throw new InvalidCredentialException(`Google provider is not enabled!`);
      }

      const client = new OAuth2Client(googleConfig.clientId, googleConfig.clientSecret);

      return await client.verifyIdToken({
        idToken: token,
        audience: googleConfig.clientId,
      });
    } catch (error) {
      throw new InvalidCredentialException('Google authentication failed', { cause: error });
    }
  }
}
