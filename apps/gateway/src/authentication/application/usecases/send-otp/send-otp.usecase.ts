import { Injectable, Logger } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { Configuration } from '@repo/config';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { OTPReason, OTPType } from '../../../domain/entities';
import { YourAccountIsBlockedException } from '../../exceptions';
import { AuthenticationNotifier } from '../../services/authentication.notifier';
import { OtpGeneration, OtpService } from '../../services/otp.service';
import { SendOtpCommand } from './send-otp.command';

@Injectable()
export class SendOtpUsecase {
  private readonly logger = new Logger(SendOtpUsecase.name);

  constructor(
    private readonly notificationSender: AuthenticationNotifier,
    private readonly configuration: Configuration,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  async execute(command: SendOtpCommand): Promise<void> {
    const email = isEmail(command.identifier) ? command.identifier : undefined;
    const mobile = isPhoneNumber(command.identifier) ? command.identifier : undefined;
    if (!mobile && !email) {
      this.logger.verbose(`to send OTP, we need email or mobile ${command.identifier}`);
      return;
    }

    let user = await this.usersService.findOneByIdentifier(command.identifier);
    if (!user) {
      if (
        this.configuration.authentication.registerUserOnSendOtp &&
        this.configuration.authentication.allowRegisterNewUser
      ) {
        user = await this.usersService.create({
          email: email,
          mobile: mobile,
          isEmailVerified: false,
          isMobileVerified: false,
        });
      } else {
        this.logger.verbose(`trying send OTP for not existing account ${command.identifier}`);
        return;
      }
    }

    if (user.isBlocked) {
      throw new YourAccountIsBlockedException();
    }

    const otpGeneration = new OtpGeneration(user.id, mobile, email, OTPType.CODE, OTPReason.LOGIN);
    const otp = await this.otpService.generate(otpGeneration);
    await this.notificationSender.sendOtp(otpGeneration, otp);
  }
}
