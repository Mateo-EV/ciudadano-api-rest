import { PasswordResetCodeRepository } from "@/contexts/app/auth/domain/contracts/repositories/password-reset-code.repository"
import { PasswordResetCode } from "@/contexts/app/auth/domain/entities/password-reset-code"
import { PasswordResetCodeMapper } from "@/contexts/app/auth/infrastructure/mappers/password-reset-code.mapper"
import { PrismaService } from "@/lib/db/prisma.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaPasswordResetCodeRepository
  implements PasswordResetCodeRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    passwordResetCode: PasswordResetCode
  ): Promise<PasswordResetCode> {
    const prismaPasswordResetCode =
      await this.prismaService.passwordResetCode.create({
        data: PasswordResetCodeMapper.prisma.toCreatePrisma(passwordResetCode)
      })

    return PasswordResetCodeMapper.prisma.toDomain(prismaPasswordResetCode)
  }

  async findByUserIdAndCode(
    userId: string,
    code: string
  ): Promise<PasswordResetCode | null> {
    const prismaPasswordResetCode =
      await this.prismaService.passwordResetCode.findFirst({
        where: {
          user_id: userId,
          code: code
        }
      })

    if (!prismaPasswordResetCode) {
      return null
    }

    return PasswordResetCodeMapper.prisma.toDomain(prismaPasswordResetCode)
  }

  async findLatestByUserId(userId: string): Promise<PasswordResetCode | null> {
    const prismaPasswordResetCode =
      await this.prismaService.passwordResetCode.findUnique({
        where: { user_id: userId }
      })

    if (!prismaPasswordResetCode) {
      return null
    }

    return PasswordResetCodeMapper.prisma.toDomain(prismaPasswordResetCode)
  }

  async deleteById(passwordResetCodeId: string): Promise<void> {
    await this.prismaService.passwordResetCode.delete({
      where: { id: Number(passwordResetCodeId) }
    })
  }

  async incrementTries(passwordResetCodeId: string): Promise<void> {
    await this.prismaService.passwordResetCode.update({
      where: { id: Number(passwordResetCodeId) },
      data: { tries: { increment: 1 } }
    })
  }
}
