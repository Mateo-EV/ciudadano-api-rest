import { MailAuthContract } from "@/contexts/app/auth/domain/contracts/mail-auth.contract"
import { PasswordResetCodeRepository } from "@/contexts/app/auth/domain/contracts/repositories/password-reset-code.repository"
import { PasswordResetCode } from "@/contexts/app/auth/domain/entities/password-reset-code"
import { AuthEmailPasswordResetThrottleExceededError } from "@/contexts/app/auth/domain/errors/auth-email-password-reset-throttle-exceeded.error"
import { Injectable } from "@nestjs/common"

@Injectable()
export class MailPasswordResetManager {
  private readonly SEND_EMAIL_INTERVAL_MS = 15 * 60 * 1000 // 15 minutes
  private readonly EXPIRATION_TIME_MS = 30 * 60 * 1000 // 30 minutes

  constructor(
    private readonly mailAuthContract: MailAuthContract,
    private readonly passwordResetCodeRepository: PasswordResetCodeRepository
  ) {}

  async sendPasswordResetCodeEmail(
    email: string,
    userId: string
  ): Promise<void> {
    const resetCode =
      await this.passwordResetCodeRepository.findLatestByUserId(userId)

    if (resetCode && !this.isTimeIntervalPassed(resetCode.createdAt)) {
      throw new AuthEmailPasswordResetThrottleExceededError()
    }

    if (resetCode) {
      await this.passwordResetCodeRepository.deleteById(resetCode.id)
    }

    const code = this.generateResetCode()

    await this.passwordResetCodeRepository.create(
      PasswordResetCode.create({
        userId,
        code,
        expiresAt: new Date(Date.now() + this.EXPIRATION_TIME_MS),
        tries: 0
      })
    )

    return await this.mailAuthContract.sendPasswordResetCodeEmail(email, code)
  }

  private isTimeIntervalPassed(lastSentAt: Date): boolean {
    const now = new Date()
    return now.getTime() - lastSentAt.getTime() >= this.SEND_EMAIL_INTERVAL_MS
  }

  private generateResetCode(): string {
    return Math.random().toString(36).substring(2, 8)
  }
}
