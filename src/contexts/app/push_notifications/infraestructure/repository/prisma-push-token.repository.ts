import { PushTokenRepository } from "@/contexts/app/push_notifications/domain/contracts/push-token.repository"
import { PushToken } from "@/contexts/app/push_notifications/domain/entities/push-token"
import { PrismaService } from "@/lib/db/prisma.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaPushTokenRepository implements PushTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async activate(pushToken: PushToken): Promise<PushToken> {
    const prismaPushToken = await this.prismaService.pushToken.upsert({
      where: { token: pushToken.token },
      update: {
        platform: pushToken.platform,
        user_id: pushToken.userId,
        is_active: pushToken.isActive
      },
      create: {
        user_id: pushToken.userId,
        token: pushToken.token,
        platform: pushToken.platform,
        is_active: pushToken.isActive
      }
    })

    return PushToken.create({
      id: prismaPushToken.id,
      userId: prismaPushToken.user_id,
      token: prismaPushToken.token,
      platform: prismaPushToken.platform as PushToken["platform"],
      createdAt: prismaPushToken.created_at,
      updatedAt: prismaPushToken.updated_at,
      isActive: prismaPushToken.is_active
    })
  }

  async desactiveByToken(token: string): Promise<void> {
    await this.prismaService.pushToken.updateMany({
      where: { token },
      data: { is_active: false }
    })
  }

  async findActiveTokens(excludeUserId?: string): Promise<PushToken[]> {
    const prismaTokens = await this.prismaService.pushToken.findMany({
      where: {
        is_active: true,
        user_id: excludeUserId ? { not: excludeUserId } : undefined
      }
    })
    return prismaTokens.map(prismaToken =>
      PushToken.create({
        id: prismaToken.id,
        userId: prismaToken.user_id,
        token: prismaToken.token,
        platform: prismaToken.platform as PushToken["platform"],
        createdAt: prismaToken.created_at,
        updatedAt: prismaToken.updated_at,
        isActive: prismaToken.is_active
      })
    )
  }

  async desactiveByTokens(tokens: string[]): Promise<void> {
    await this.prismaService.pushToken.updateMany({
      where: { token: { in: tokens } },
      data: { is_active: false }
    })
  }
}
