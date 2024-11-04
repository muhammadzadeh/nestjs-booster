import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Configuration } from '@repo/config';

@Injectable()
export class CheckSignupGuard implements CanActivate {
  private readonly logger = new Logger(CheckSignupGuard.name);

  constructor(private readonly configuration: Configuration) {}

  async canActivate(_: ExecutionContext): Promise<boolean> {
    if (!this.configuration.authentication.allowRegisterNewUser) {
      this.logger.debug('Register new user is not allowed! view authentication config allowRegisterNewUser flag.');
    }

    return this.configuration.authentication.allowRegisterNewUser;
  }
}
