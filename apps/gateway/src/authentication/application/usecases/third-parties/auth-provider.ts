import { Email } from '@repo/types/common.types';

export interface AuthProvider {
  authenticate(data: Auth): Promise<AuthUser>;
  isSupport(type: AuthProviderType): boolean;
  getName(): AuthProviderType;
}

export interface Auth {
  token: string;
}

export enum AuthProviderType {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
}

export class AuthUser {
  constructor(
    readonly providerId: string,
    readonly provider: AuthProviderType,
    readonly email: Email | null,
    readonly firstName: string | null,
    readonly lastName: string | null,
    readonly avatar: string | null,
  ) {}
}
