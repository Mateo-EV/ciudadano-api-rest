import { Group } from "@/contexts/app/chats/domain/entities/group"
import { GroupMessage } from "@/contexts/app/chats/domain/entities/group-message"
import { GroupUser } from "@/contexts/app/chats/domain/entities/group-user"
import type {
  Prisma,
  Group as PrismaGroup,
  GroupUser as PrismaGroupUser,
  GroupMessage as PrismaGroupMessage,
  User as PrismaUser
} from "@prisma/client"

export class GroupMapper {
  static prisma = {
    toDomain(
      prismaGroup: PrismaGroup & {
        members: (PrismaGroupUser & { user: PrismaUser })[]
      }
    ): Group {
      return Group.create({
        id: prismaGroup.id,
        name: prismaGroup.name,
        createdAt: prismaGroup.creation_date,
        description: prismaGroup.description,
        members: prismaGroup.members.map(prismaGroupUser =>
          GroupUser.create({
            groupId: prismaGroupUser.group_id,
            userId: prismaGroupUser.user_id,
            joinedAt: prismaGroupUser.join_date,
            user: {
              id: prismaGroupUser.user.id,
              firstName: prismaGroupUser.user.first_name,
              lastName: prismaGroupUser.user.last_name,
              phone: prismaGroupUser.user.phone ?? ""
            }
          })
        )
      })
    },
    toCreatePrisma(group: Group): Prisma.GroupCreateArgs["data"] {
      return {
        id: group.id,
        name: group.name,
        creation_date: group.createdAt,
        description: group.description,
        members: {
          createMany: {
            data: group.members.map(member => ({
              user_id: member.userId,
              join_date: member.joinedAt
            }))
          }
        }
      }
    },
    toMessageDomain(
      prismaMessage: PrismaGroupMessage & { user: PrismaUser }
    ): GroupMessage {
      return GroupMessage.create({
        id: prismaMessage.id,
        groupId: prismaMessage.group_id,
        content: prismaMessage.content,
        createdAt: prismaMessage.created_at,
        senderId: prismaMessage.user_id,
        sender: {
          id: prismaMessage.user.id,
          firstName: prismaMessage.user.first_name,
          lastName: prismaMessage.user.last_name,
          phone: prismaMessage.user.phone ?? ""
        }
      })
    },
    toMessageCreate(
      message: GroupMessage
    ): Prisma.GroupMessageCreateArgs["data"] {
      return {
        id: message.id,
        group_id: message.groupId,
        content: message.content,
        user_id: message.senderId,
        created_at: message.createdAt
      }
    }
  }
}
