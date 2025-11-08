import * as jose from "jose"
import type { TokenContract } from "../../domain/contracts/token.contract"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class TokenService implements TokenContract {
  constructor(private configService: ConfigService) {}

  private readonly EXPIRATION_TIME: number = 60 * 60 * 24 * 30 // 30 days in seconds

  async generate(userId: string): Promise<string> {
    const token = await new jose.SignJWT()
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(this.EXPIRATION_TIME)
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .sign(new TextEncoder().encode(this.configService.get("JWT_SECRET")))

    return token
  }

  async verify(token: string): Promise<string> {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(this.configService.get("JWT_SECRET"))
    )

    if (!payload.sub || typeof payload.sub !== "string") {
      throw new Error("Invalid token payload")
    }

    return payload.sub
  }
}
