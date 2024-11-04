import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationModule } from '../../authentication/infrastructure/authentication.module';
import { ThrottlerBehindProxyGuard } from './throttler-behind-proxy.guard';

@Module({
  imports: [PassportModule, AuthenticationModule],
  providers: [ThrottlerBehindProxyGuard],
  exports: [],
})
export class AuthModule {}
