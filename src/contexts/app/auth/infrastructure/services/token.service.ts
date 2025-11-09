import type { TokenContract } from "../../domain/contracts/token.contract"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class TokenService implements TokenContract {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  static readonly EXPIRATION_TIME: number = 60 * 60 * 24 * 30 // 30 days in seconds

  async generate(userId: string): Promise<string> {
    const payload = { sub: userId }
    return this.jwtService.signAsync(payload)
  }

  async verify(token: string): Promise<string> {
    const payload = await this.jwtService.verifyAsync<{ sub: string }>(token)
    return payload.sub
  }
}
