import type { Group } from "@/contexts/app/chats/domain/entities/group"
import type { GroupMessage } from "@/contexts/app/chats/domain/entities/group-message"
import type { CursorPaginated } from "@/utils/cursor-paginated"

export abstract class GroupRepository {
  abstract create(group: Group): Promise<Group>
  abstract findById(id: string): Promise<Group | null>
  abstract createMessage(groupMessage: GroupMessage): Promise<GroupMessage>
  abstract findMessagesCursorPaginatedByGroupId(
    groupId: string,
    cursor?: string
  ): Promise<CursorPaginated<GroupMessage>>
}
