import type { GroupRepository } from "@/contexts/app/chats/domain/contracts/group.repository"
import type { Group } from "@/contexts/app/chats/domain/entities/group"
import type { GroupMessage } from "@/contexts/app/chats/domain/entities/group-message"
import { GroupMapper } from "@/contexts/app/chats/infraestructure/mappers/group.mapper"
import type { PrismaService } from "@/lib/db/prisma.service"
import type { CursorPaginated } from "@/utils/cursor-paginated"

export class PrismaGroupRepository implements GroupRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(group: Group): Promise<Group> {
    const prismaGroup = await this.prismaService.group.create({
      data: GroupMapper.prisma.toCreatePrisma(group),
      include: {
        members: true
      }
    })

    return GroupMapper.prisma.toDomain(prismaGroup)
  }

  async createMessage(groupMessage: GroupMessage): Promise<GroupMessage> {
    const prismaMessage = await this.prismaService.groupMessage.create({
      data: GroupMapper.prisma.toMessageCreate(groupMessage)
    })

    return GroupMapper.prisma.toMessageDomain(prismaMessage)
  }

  async findById(id: string): Promise<Group | null> {
    const prismaGroup = await this.prismaService.group.findUnique({
      where: { id },
      include: {
        members: true
      }
    })

    if (!prismaGroup) {
      return null
    }

    return GroupMapper.prisma.toDomain(prismaGroup)
  }

  async findMessagesCursorPaginatedByGroupId(
    groupId: string,
    cursor?: string | null
  ): Promise<CursorPaginated<GroupMessage>> {
    const prismaMessages = await this.prismaService.groupMessage.findMany({
      where: { group_id: groupId },
      cursor: cursor ? { id: cursor } : undefined,
      take: 10 + 1,
      orderBy: { created_at: "desc" }
    })

    const hasMore = prismaMessages.length > 10
    let nextCursor: string | undefined = undefined
    if (hasMore) {
      const nextItem = prismaMessages.pop()
      nextCursor = nextItem?.id
    }

    return {
      items: prismaMessages.map(prismaMessage =>
        GroupMapper.prisma.toMessageDomain(prismaMessage)
      ),
      nextCursor: nextCursor ?? null
    }
  }
}
