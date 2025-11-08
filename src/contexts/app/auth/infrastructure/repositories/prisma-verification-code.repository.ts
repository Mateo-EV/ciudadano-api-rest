import { Injectable } from "@nestjs/common"
import { VerificationCodeRepository } from "../../domain/contracts/repositories/verification-code.repository"
import { VerificationCode } from "../../domain/entities/verification-code"
import { PrismaService } from "@/lib/db/prisma.service"
import { VerificationCodeMapper } from "../mappers/verification-code.mapper"

@Injectable()
export class PrismaVerificationCodeRepository
  implements VerificationCodeRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(verificationCode: VerificationCode): Promise<VerificationCode> {
    const prismaVerificationCode =
      await this.prismaService.verificationCode.create({
        data: VerificationCodeMapper.prisma.toCreatePrisma(verificationCode)
      })

    return VerificationCodeMapper.prisma.toDomain(prismaVerificationCode)
  }

  async delete(verificationCodeId: string): Promise<void> {
    await this.prismaService.verificationCode.delete({
      where: { id: Number(verificationCodeId) }
    })
  }

  async findByUserIdAndCode(
    userId: string,
    code: string
  ): Promise<VerificationCode | null> {
    const prismaVerificationCode =
      await this.prismaService.verificationCode.findFirst({
        where: {
          user_id: userId,
          code: code
        }
      })

    if (!prismaVerificationCode) return null

    return VerificationCodeMapper.prisma.toDomain(prismaVerificationCode)
  }

  async findLatestByUserId(userId: string): Promise<VerificationCode | null> {
    const prismaVerificationCode =
      await this.prismaService.verificationCode.findUnique({
        where: { user_id: userId }
      })

    if (!prismaVerificationCode) return null

    return VerificationCodeMapper.prisma.toDomain(prismaVerificationCode)
  }

  async incrementTries(verificationCodeId: string): Promise<void> {
    await this.prismaService.verificationCode.update({
      data: {
        tries: {
          increment: 1
        }
      },
      where: { id: Number(verificationCodeId) }
    })
  }
}
