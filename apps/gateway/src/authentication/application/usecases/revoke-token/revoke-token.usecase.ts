import { Injectable } from '@nestjs/common';
import { JwtTokenService } from '../../services/jwt-token.service';
import { RevokeTokenCommand } from './revoke-token.command';

@Injectable()
export class RevokeTokenUsecase {
  constructor(private readonly jwtService: JwtTokenService) {}

  async execute(command: RevokeTokenCommand): Promise<void> {
    await this.jwtService.revokeToken(command);
  }
}
