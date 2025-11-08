import type { VerificationCode } from "../../entities/verification-code"

export abstract class VerificationCodeRepository {
  abstract create(verificationCode: VerificationCode): Promise<VerificationCode>
  abstract findByUserIdAndCode(
    userId: string,
    code: string
  ): Promise<VerificationCode | null>
  abstract findLatestByUserId(userId: string): Promise<VerificationCode | null>
  abstract incrementTries(verificationCodeId: string): Promise<void>
  abstract delete(verificationCodeId: string): Promise<void>
}
