import { HashContract } from "@/contexts/app/auth/domain/contracts/hash.contract"
import { PasswordResetCodeRepository } from "@/contexts/app/auth/domain/contracts/repositories/password-reset-code.repository"
import { PasswordResetCode } from "@/contexts/app/auth/domain/entities/password-reset-code"
import { AuthCodeExpiredToResetPasswordError } from "@/contexts/app/auth/domain/errors/auth-code-expired-to-reset-password.error"
import { AuthCodeInvalidToResetPasswordError } from "@/contexts/app/auth/domain/errors/auth-code-invalid-to-reset-password.error"
import { AuthCodeReachedLimitTriesToResetPasswordError } from "@/contexts/app/auth/domain/errors/auth-code-reached-limit-tries-to-reset-password.error"
import { AuthInvalidEmailOrCodeToResetPassword } from "@/contexts/app/auth/domain/errors/auth-invalid-email-or-code-to-reset-password.error"
import { UserRepository } from "@/contexts/app/user/domain/contracts/user.repository"
import { User } from "@/contexts/app/user/domain/entities/user"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

interface ResetPasswordInput {
  code: string
  email: string
  newPassword: string
}

@Injectable()
export class ResetPasswordUseCase implements UseCase<ResetPasswordInput, void> {
  constructor(
    private readonly passwordResetCodeRepository: PasswordResetCodeRepository,
    private readonly userRepository: UserRepository,
    private readonly hashContract: HashContract
  ) {}

  private MAX_PASSWORD_RESET_CODE_TRIES = 3

  async execute(input: ResetPasswordInput): Promise<void> {
    const { code, email, newPassword } = input

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AuthInvalidEmailOrCodeToResetPassword()
    }

    const resetCode = await this.passwordResetCodeRepository.findLatestByUserId(
      user.id
    )

    if (!resetCode) {
      throw new AuthInvalidEmailOrCodeToResetPassword()
    }

    if (resetCode.code !== code) {
      await this.passwordResetCodeRepository.incrementTries(resetCode.id)
      throw new AuthCodeInvalidToResetPasswordError(email)
    }

    await this.validateResetCode(resetCode, email)

    const hashedPassword = await this.hashContract.hash(newPassword)

    await this.userRepository.updateById(
      user.id,
      User.create({ password: hashedPassword })
    )
  }

  private async validateResetCode(
    resetCode: PasswordResetCode,
    email: string
  ): Promise<void> {
    if (resetCode.expiresAt < new Date()) {
      await this.passwordResetCodeRepository.deleteById(resetCode.id)

      throw new AuthCodeExpiredToResetPasswordError(email)
    }

    if (resetCode.tries >= this.MAX_PASSWORD_RESET_CODE_TRIES) {
      await this.passwordResetCodeRepository.deleteById(resetCode.id)

      throw new AuthCodeReachedLimitTriesToResetPasswordError(email)
    }
  }
}
