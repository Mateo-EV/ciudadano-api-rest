import { Module } from "@nestjs/common"
import { UserModule } from "../user/user.module"
import { MailVerificationManager } from "./application/managers/mail-verification.manager"
import { LoginAuthUseCase } from "./application/usecases/login-auth.use-case"
import { RegisterAuthUserCase } from "./application/usecases/register-auth.user-case"
import { HashContract } from "./domain/contracts/hash.contract"
import { MailAuthContract } from "./domain/contracts/mail-auth.contract"
import { VerificationCodeRepository } from "./domain/contracts/repositories/verification-code.repository"
import { TokenContract } from "./domain/contracts/token.contract"
import { PrismaVerificationCodeRepository } from "./infrastructure/repositories/prisma-verification-code.repository"
import { HashService } from "./infrastructure/services/hash.service"
import { MailAuthService } from "./infrastructure/services/mail-auth.service"
import { TokenService } from "./infrastructure/services/token.service"
import { APP_FILTER } from "@nestjs/core"
import { VerifyEmailUseCase } from "./application/usecases/verify-email.use-case"
import { AuthFilterException } from "./infrastructure/rest/filters/auth-exception-handler"
import { AuthController } from "./infrastructure/rest/controllers/auth.controller"

@Module({
  imports: [UserModule],
  providers: [
    // USECASES
    LoginAuthUseCase,
    RegisterAuthUserCase,
    VerifyEmailUseCase,
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
    { provide: APP_FILTER, useClass: AuthFilterException }
  ],
  controllers: [AuthController]
})
export class AuthModule {}
