import { Injectable } from "@nestjs/common"
import { MailAuthContract } from "../../domain/contracts/mail-auth.contract"
import { VerificationCodeRepository } from "../../domain/contracts/repositories/verification-code.repository"
import { AuthEmailVerificationThrottleExceededError } from "../../domain/errors/auth-email-verification-throttle-exceeded-error"
import { VerificationCode } from "../../domain/entities/verification-code"
import { HashContract } from "../../domain/contracts/hash.contract"

@Injectable()
export class MailVerificationManager {
  private readonly SEND_EMAIL_INTERVAL_MS = 15 * 60 * 1000
  private readonly EXPIRATION_TIME_MS = 30 * 60 * 1000

  constructor(
    private readonly mailAuthContract: MailAuthContract,
    private readonly verificationCodeRepository: VerificationCodeRepository,
    private readonly hashContract: HashContract
  ) {}

  async sendVerificationCode(email: string, userId: string): Promise<void> {
    const existingCode =
      await this.verificationCodeRepository.findLatestByUserId(userId)

    if (existingCode && !this.isTimeIntervalPassed(existingCode.sentAt)) {
      throw new AuthEmailVerificationThrottleExceededError()
    }

    if (existingCode) {
      await this.verificationCodeRepository.delete(existingCode.id)
    }

    const code = this.generateVerificationCode()

    await this.verificationCodeRepository.create(
      VerificationCode.create({
        userId,
        code: await this.hashContract.hash(code),
        expiresAt: new Date(Date.now() + this.EXPIRATION_TIME_MS)
      })
    )

    return await this.mailAuthContract.sendVerificationCodeEmail(email, code)
  }

  private generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 8)
  }

  private isTimeIntervalPassed(lastSentAt: Date): boolean {
    const now = new Date()
    return now.getTime() - lastSentAt.getTime() >= this.SEND_EMAIL_INTERVAL_MS
  }
}
