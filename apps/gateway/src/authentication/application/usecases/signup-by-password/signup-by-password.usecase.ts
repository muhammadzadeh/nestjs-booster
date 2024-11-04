import { Injectable, Logger } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { OTPReason, OTPType } from '../../../domain/entities';
import { InvalidIdentifierException, UserAlreadyRegisteredException } from '../../exceptions';
import { AuthenticationNotifier } from '../../services/authentication.notifier';
import { OtpGeneration, OtpService } from '../../services/otp.service';
import { SignupByPasswordCommand } from './signup-by-password.command';

@Injectable()
export class SignupByPasswordUsecase {
  private readonly logger = new Logger(SignupByPasswordUsecase.name);

  constructor(
    private readonly notificationSender: AuthenticationNotifier,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  async execute(command: SignupByPasswordCommand): Promise<void> {
    const user = await this.usersService.findOneByIdentifier(command.identifier);
    if (user) {
      throw new UserAlreadyRegisteredException(`User with identifier ${command.identifier} already exists.`);
    }

    const email = isEmail(command.identifier) ? command.identifier : undefined;
    const mobile = isPhoneNumber(command.identifier) ? command.identifier : undefined;
    if (!mobile && !email) {
      this.logger.verbose(`Email or mobile is  missing for identifier ${command.identifier}`);
      throw new InvalidIdentifierException(`Invalid identifier, Email or Phone number must be provided`);
    }

    const createdUser = await this.usersService.create({
      email: email,
      mobile: mobile,
      isEmailVerified: false,
      isMobileVerified: false,
      password: command.password,
    });

    const otpGeneration = new OtpGeneration(createdUser.id, mobile, email, OTPType.CODE, OTPReason.VERIFY);
    const otp = await this.otpService.generate(otpGeneration);
    await this.notificationSender.sendOtp(otpGeneration, otp);
  }
}
