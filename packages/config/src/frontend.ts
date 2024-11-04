import { Type } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';


export class FrontEndConfig {
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly baseUrl!: string;

  signupUrl!: string;

  signinUrl!: string;

  resetPasswordUrl!: string;

  verifyOtpUrl!: string;


  revalidate() {
    this.signupUrl = `${this.baseUrl}/register`;
    this.signinUrl = `${this.baseUrl}/login`;
    this.resetPasswordUrl = `${this.baseUrl}/reset-password`;
    this.verifyOtpUrl = `${this.baseUrl}/login`;
  }
}
