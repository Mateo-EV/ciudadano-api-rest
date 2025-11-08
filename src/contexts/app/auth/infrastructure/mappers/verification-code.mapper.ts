import type {
  Prisma,
  VerificationCode as PrismaVerificationCode
} from "@prisma/client"
import { VerificationCode } from "../../domain/entities/verification-code"

export class VerificationCodeMapper {
  static prisma = {
    toDomain(verificationCodePrisma: PrismaVerificationCode): VerificationCode {
      return VerificationCode.create({
        id: String(verificationCodePrisma.id),
        userId: verificationCodePrisma.user_id,
        code: verificationCodePrisma.code,
        sentAt: verificationCodePrisma.created_at,
        expiresAt: verificationCodePrisma.expires_at,
        tries: verificationCodePrisma.tries
      })
    },
    toCreatePrisma(
      verificationCode: VerificationCode
    ): Prisma.VerificationCodeCreateArgs["data"] {
      return {
        user_id: verificationCode.userId,
        code: verificationCode.code,
        created_at: verificationCode.sentAt,
        expires_at: verificationCode.expiresAt,
        tries: verificationCode.tries
      }
    }
  }
}
