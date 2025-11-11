import type { PasswordResetCode } from "@/contexts/app/auth/domain/entities/password-reset-code"

export abstract class PasswordResetCodeRepository {
  abstract create(
    passwordResetCode: PasswordResetCode
  ): Promise<PasswordResetCode>

  abstract findByUserIdAndCode(
    userId: string,
    code: string
  ): Promise<PasswordResetCode | null>

  abstract findLatestByUserId(userId: string): Promise<PasswordResetCode | null>
  abstract incrementTries(passwordResetCodeId: string): Promise<void>
  abstract deleteById(passwordResetCodeId: string): Promise<void>
}
