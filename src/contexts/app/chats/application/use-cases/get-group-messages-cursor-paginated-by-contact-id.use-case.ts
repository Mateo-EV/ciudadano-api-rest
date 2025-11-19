import { GetGroupByIdUseCase } from "@/contexts/app/chats/application/use-cases/get-group-by-id.use-case"
import { GroupRepository } from "@/contexts/app/chats/domain/contracts/group.repository"
import { GroupMessage } from "@/contexts/app/chats/domain/entities/group-message"
import { User } from "@/contexts/app/user/domain/entities/user"
import { CursorPaginated } from "@/utils/cursor-paginated"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type GetGroupMessagesCursorPaginatedByGroupIdInput = {
  groupId: string
  cursor?: string
  userOwner: User
}

@Injectable()
export class GetGroupMessagesCursorPaginatedByGroupIdUseCase
  implements
    UseCase<
      GetGroupMessagesCursorPaginatedByGroupIdInput,
      CursorPaginated<GroupMessage>
    >
{
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly getGroupByIdUseCase: GetGroupByIdUseCase
  ) {}

  async execute(
    input: GetGroupMessagesCursorPaginatedByGroupIdInput
  ): Promise<CursorPaginated<GroupMessage>> {
    const group = await this.getGroupByIdUseCase.execute({
      groupId: input.groupId,
      userOwnerId: input.userOwner.id
    })

    return await this.groupRepository.findMessagesCursorPaginatedByGroupId(
      group.id,
      input.cursor
    )
  }
}
