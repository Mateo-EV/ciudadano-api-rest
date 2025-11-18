import { GroupRepository } from "@/contexts/app/chats/domain/contracts/group.repository"
import { Group } from "@/contexts/app/chats/domain/entities/group"
import { GroupNotFoundError } from "@/contexts/app/chats/domain/errors/group-not-found.error"
import { UnuauthorizedGroupForUserError } from "@/contexts/app/chats/domain/errors/unauthorized-group-for-user.error"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type GetGroupByIdInput = {
  groupId: string
  userOwnerId: string
}

@Injectable()
export class GetGroupByIdUseCase implements UseCase<GetGroupByIdInput, Group> {
  constructor(private readonly groupRepository: GroupRepository) {}
  async execute(input: GetGroupByIdInput): Promise<Group> {
    const group = await this.groupRepository.findById(input.groupId)

    if (!group) {
      throw new GroupNotFoundError()
    }

    if (!group.members.some(member => member.userId === input.userOwnerId)) {
      throw new UnuauthorizedGroupForUserError()
    }

    return group
  }
}
