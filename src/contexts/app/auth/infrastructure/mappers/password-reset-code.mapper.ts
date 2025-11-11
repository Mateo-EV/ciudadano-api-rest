import { PasswordResetCode } from "@/contexts/app/auth/domain/entities/password-reset-code"
import type {
  Prisma,
  PasswordResetCode as PrismaPasswordResetCode
} from "@prisma/client"

export class PasswordResetCodeMapper {
  static prisma = {
    toDomain(passwordResetCode: PrismaPasswordResetCode): PasswordResetCode {
      return PasswordResetCode.create({
        id: String(passwordResetCode.id),
        userId: passwordResetCode.user_id,
        code: passwordResetCode.code,
        expiresAt: passwordResetCode.expires_at,
        createdAt: passwordResetCode.created_at,
        tries: passwordResetCode.tries
      })
    },
    toCreatePrisma(
      passwordResetCode: PasswordResetCode
    ): Prisma.PasswordResetCodeCreateArgs["data"] {
      return {
        user_id: passwordResetCode.userId,
        code: passwordResetCode.code,
        expires_at: passwordResetCode.expiresAt,
        tries: passwordResetCode.tries
      }
    }
  }
}
