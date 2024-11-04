import { Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommonController } from '@repo/decorator';
import { Captcha } from '../../../common/captcha/infrastructure/web/decorators';
import { DoneResponse } from '@repo/types/serialization';
import { AuthService } from '../../application/services/auth.service';
import { IgnoreAuthorizationGuard, Signup } from './decorators';
import {
  AuthenticateByThirdPartyDto,
  AuthenticationResponse,
  IdentifierDto,
  IdentifierPasswordAuthDto,
  IdentifierPasswordSignupDto,
  ImpersonationDto,
  OtpGenerationDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SigninByOtpDto,
  SignupByOtpDto,
  VerifyDto,
} from './dtos';

@IgnoreAuthorizationGuard()
@ApiTags('Authentication')
@CommonController(`/auth`)
export class AuthenticationController {
  constructor(private readonly authService: AuthService) {}

  @Signup('signup/identifier-password')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async signupByIdentifierPassword(@Body() dto: IdentifierPasswordSignupDto): Promise<DoneResponse> {
    await this.authService.signupByPassword(dto.toSignupByPasswordData());
    return new DoneResponse();
  }

  @Signup('signup/google')
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signupByGoogle(@Body() dto: AuthenticateByThirdPartyDto): Promise<AuthenticationResponse> {
    const token = await this.authService.signupByThirdParty(dto.toAuthenticateByThirdPartyData());
    return AuthenticationResponse.from(token!);
  }

  @Signup('signup/otp')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async signupByOtp(@Body() dto: SignupByOtpDto): Promise<DoneResponse> {
    await this.authService.signupByOtp(dto.toSignupByOtpData());
    return new DoneResponse();
  }

  @Post('verify')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async verify(@Body() dto: VerifyDto): Promise<AuthenticationResponse> {
    const token = await this.authService.verify(dto.toVerifyData());
    return AuthenticationResponse.from(token);
  }

  @Post('signin/identifier-password')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByIdentifierPassword(@Body() dto: IdentifierPasswordAuthDto): Promise<AuthenticationResponse> {
    const token = await this.authService.signinByPassword(dto.toSigninByPasswordData());
    return AuthenticationResponse.from(token);
  }

  @Post('signin/google')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByGoogle(@Body() dto: AuthenticateByThirdPartyDto): Promise<AuthenticationResponse> {
    const token = await this.authService.signinByThirdParty(dto.toAuthenticateByThirdPartyData());
    return AuthenticationResponse.from(token);
  }

  @Post('signin/otp')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByOtp(@Body() dto: SigninByOtpDto): Promise<AuthenticationResponse> {
    const token = await this.authService.signinByOtp(dto.toSigninByOtpData());
    return AuthenticationResponse.from(token);
  }

  @Post('signin/fake')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByFake(@Body() dto: ImpersonationDto): Promise<AuthenticationResponse> {
    const token = await this.authService.impersonation(dto.toImpersonationData());
    return AuthenticationResponse.from(token);
  }

  @Post('otp')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async generateOtp(@Body() input: OtpGenerationDto): Promise<DoneResponse> {
    await this.authService.sendOtp(input.toSendOtp());
    return new DoneResponse();
  }

  @Post('password/reset-link')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async sendResetPasswordLink(@Body() input: IdentifierDto): Promise<DoneResponse> {
    await this.authService.requestResetPassword(input.identifier);
    return new DoneResponse();
  }

  @Post('password/reset')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<DoneResponse> {
    await this.authService.resetPassword(dto.toOTPVerification(), dto.newPassword);
    return new DoneResponse();
  }

  @Post('refresh-token')
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async refreshToken(@Body() input: RefreshTokenDto): Promise<AuthenticationResponse> {
    const token = await this.authService.refreshToken(input.toRefreshTokenData());
    return AuthenticationResponse.from(token);
  }
}
