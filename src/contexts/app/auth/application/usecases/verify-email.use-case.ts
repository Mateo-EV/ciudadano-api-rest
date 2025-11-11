import { UserRepository } from "@/contexts/app/user/domain/contracts/user.repository"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { AuthInvalidEmailOrCodeToVerify } from "../../domain/errors/auth-invalid-email-or-code-to-verify"
import { AuthEmailAlreadyVerified } from "../../domain/errors/auth-email-already-verified"
import { VerificationCodeRepository } from "../../domain/contracts/repositories/verification-code.repository"
import { VerificationCode } from "../../domain/entities/verification-code"
import { AuthCodeInvalidToVerifyEmailError } from "@/contexts/app/auth/domain/errors/auth-code-invalid-to-verify-email.error"
import { AuthCodeExpiredToVerifyEmailError } from "@/contexts/app/auth/domain/errors/auth-code-expired-to-verify-email.error"
import { AuthCodeReachedLimitTriesToVerifyEmailError } from "@/contexts/app/auth/domain/errors/auth-code-reached-limit-tries-to-verify-email.error"

interface VerifyEmailUseCaseInput {
  code: string
  email: string
}

@Injectable()
export class VerifyEmailUseCase
  implements UseCase<VerifyEmailUseCaseInput, void>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationCodeRepository: VerificationCodeRepository
  ) {}

  private MAX_VERIFICATION_CODE_TRIES = 5

  async execute(input: VerifyEmailUseCaseInput): Promise<void> {
    const user = await this.userRepository.findByEmail(input.email)

    if (!user) {
      throw new AuthInvalidEmailOrCodeToVerify()
    }

    if (user.isEmailVerified) {
      throw new AuthEmailAlreadyVerified()
    }

    const verificationCode =
      await this.verificationCodeRepository.findLatestByUserId(user.id)

    if (!verificationCode) {
      throw new AuthInvalidEmailOrCodeToVerify()
    }

    if (verificationCode.code !== input.code) {
      await this.verificationCodeRepository.incrementTries(verificationCode.id)

      throw new AuthCodeInvalidToVerifyEmailError(input.email)
    }

    await this.validateVerificationCode(verificationCode, input.email)

    await this.userRepository.markEmailAsVerified(user.id)
  }

  private async validateVerificationCode(
    verificationCode: VerificationCode,
    email: string
  ): Promise<void> {
    if (verificationCode.expiresAt < new Date()) {
      await this.verificationCodeRepository.delete(verificationCode.id)
      throw new AuthCodeExpiredToVerifyEmailError(email)
    }

    if (verificationCode.tries >= this.MAX_VERIFICATION_CODE_TRIES) {
      await this.verificationCodeRepository.delete(verificationCode.id)
      throw new AuthCodeReachedLimitTriesToVerifyEmailError(email)
    }
  }
}
