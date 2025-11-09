import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { APP_FILTER, APP_GUARD } from "@nestjs/core"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "../user/user.module"
import { MailVerificationManager } from "./application/managers/mail-verification.manager"
import { GetAuthProfileUseCase } from "./application/usecases/get-auth-profile.use-case"
import { LoginAuthUseCase } from "./application/usecases/login-auth.use-case"
import { RegisterAuthUserCase } from "./application/usecases/register-auth.user-case"
import { ResendEmailVerificationCodeUseCase } from "./application/usecases/resend-email-verification-code.use-case"
import { VerifyEmailUseCase } from "./application/usecases/verify-email.use-case"
import { HashContract } from "./domain/contracts/hash.contract"
import { MailAuthContract } from "./domain/contracts/mail-auth.contract"
import { VerificationCodeRepository } from "./domain/contracts/repositories/verification-code.repository"
import { TokenContract } from "./domain/contracts/token.contract"
import { PrismaVerificationCodeRepository } from "./infrastructure/repositories/prisma-verification-code.repository"
import { AuthController } from "./infrastructure/rest/controllers/auth.controller"
import { AuthExceptionHandler } from "./infrastructure/rest/filters/auth-exception-handler"
import { JwtAuthGuard } from "./infrastructure/rest/guards/jwt-auth.guard"
import { JwtStrategy } from "./infrastructure/rest/strategies/jwt.strategy"
import { HashService } from "./infrastructure/services/hash.service"
import { MailAuthService } from "./infrastructure/services/mail-auth.service"
import { TokenService } from "./infrastructure/services/token.service"

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: TokenService.EXPIRATION_TIME
        }
      })
    })
  ],
  providers: [
    // USECASES
    LoginAuthUseCase,
    RegisterAuthUserCase,
    VerifyEmailUseCase,
    ResendEmailVerificationCodeUseCase,
    GetAuthProfileUseCase,
    // MANAGERS
    MailVerificationManager,
    // CONTRACTS
    { provide: HashContract, useClass: HashService },
    { provide: TokenContract, useClass: TokenService },
    { provide: MailAuthContract, useClass: MailAuthService },
    {
      provide: VerificationCodeRepository,
      useClass: PrismaVerificationCodeRepository
    },
    // FILTERS
    { provide: APP_FILTER, useClass: AuthExceptionHandler },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // STRATEGIES
    JwtStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
