import { Injectable } from '@nestjs/common';
import { JwtTokenService, Token } from '../../services/jwt-token.service';
import { RefreshTokenCommand } from './refresh-token.command';

@Injectable()
export class RefreshTokenUsecase {
  constructor(private readonly jwtService: JwtTokenService) {}

  async execute(command: RefreshTokenCommand): Promise<Token> {
    return await this.jwtService.refresh(command);
  }
}
