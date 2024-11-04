import { Injectable, Logger } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { OTPReason, OTPType } from '../../../domain/entities';
import { YourAccountIsBlockedException } from '../../exceptions';
import { AuthenticationNotifier } from '../../services/authentication.notifier';
import { OtpGeneration, OtpService } from '../../services/otp.service';
import { RequestResetPasswordCommand } from './request-reset-password.command';

@Injectable()
export class RequestResetPasswordUsecase {
  private readonly logger = new Logger(RequestResetPasswordUsecase.name);

  constructor(
    private readonly notificationSender: AuthenticationNotifier,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  async execute(command: RequestResetPasswordCommand): Promise<void> {
    const user = await this.usersService.findOneByIdentifier(command.identifier);
    if (!user) {
      this.logger.verbose(`trying to reset password for not existing account ${command.identifier}`);
      return;
    }

    if (user.isBlocked) {
      throw new YourAccountIsBlockedException();
    }

    const email = isEmail(command.identifier) ? command.identifier : undefined;
    const mobile = isPhoneNumber(command.identifier) ? command.identifier : undefined;
    if (!mobile && !email) {
      this.logger.verbose(`to send reset password code, we need email or mobile ${command.identifier}`);
      return;
    }

    const otpGeneration = new OtpGeneration(user.id, mobile, email, OTPType.CODE, OTPReason.RESET_PASSWORD);
    const otp = await this.otpService.generate(otpGeneration);
    await this.notificationSender.sendOtp(otpGeneration, otp);
  }
}
