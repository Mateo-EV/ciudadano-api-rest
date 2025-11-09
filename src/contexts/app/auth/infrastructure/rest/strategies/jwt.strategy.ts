import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { GetAuthProfileUseCase } from "../../../application/usecases/get-auth-profile.use-case"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly getAuthProfileUseCase: GetAuthProfileUseCase
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("JWT_SECRET") ?? ""
    })
  }

  async validate(payload: { sub: string }) {
    const user = await this.getAuthProfileUseCase.execute(payload.sub)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
