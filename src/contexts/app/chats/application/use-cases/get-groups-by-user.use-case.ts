import { GroupRepository } from "@/contexts/app/chats/domain/contracts/group.repository"
import type { Group } from "@/contexts/app/chats/domain/entities/group"
import type { User } from "@/contexts/app/user/domain/entities/user"
import type { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type GetGroupsByUserInput = {
  user: User
}

@Injectable()
export class GetGroupsByUserUseCase
  implements UseCase<GetGroupsByUserInput, Group[]>
{
  constructor(private readonly groupRepository: GroupRepository) {}

  async execute(input: GetGroupsByUserInput): Promise<Group[]> {
    return this.groupRepository.findByUserId(input.user.id)
  }
}
