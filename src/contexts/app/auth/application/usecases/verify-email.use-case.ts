import { UserRepository } from "@/contexts/app/user/domain/contracts/user.repository"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { AuthInvalidEmailOrCodeToVerify } from "../../domain/errors/auth-invalid-email-or-code-to-verify"
import { AuthEmailAlreadyVerified } from "../../domain/errors/auth-email-already-verified"
import { VerificationCodeRepository } from "../../domain/contracts/repositories/verification-code.repository"
import { VerificationCode } from "../../domain/entities/verification-code"

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
      await this.verificationCodeRepository.findByUserIdAndCode(
        user.id,
        input.code
      )

    if (!verificationCode) {
      throw new AuthInvalidEmailOrCodeToVerify()
    }

    const isCodeValid = await this.validateVerificationCode(verificationCode)

    if (!isCodeValid) {
      await this.verificationCodeRepository.incrementTries(verificationCode.id)

      throw new AuthInvalidEmailOrCodeToVerify()
    }

    await this.userRepository.markEmailAsVerified(user.id)
  }

  private async validateVerificationCode(
    verificationCode: VerificationCode
  ): Promise<boolean> {
    if (verificationCode.expiresAt < new Date()) {
      await this.verificationCodeRepository.delete(verificationCode.id)

      return false
    }

    if (verificationCode.tries >= this.MAX_VERIFICATION_CODE_TRIES) {
      await this.verificationCodeRepository.delete(verificationCode.id)
      return false
    }

    return true
  }
}
