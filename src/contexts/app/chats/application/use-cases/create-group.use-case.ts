import { GroupRepository } from "@/contexts/app/chats/domain/contracts/group.repository"
import { Group } from "@/contexts/app/chats/domain/entities/group"
import { GroupUser } from "@/contexts/app/chats/domain/entities/group-user"
import { CannotAddHimselfToGroupError } from "@/contexts/app/chats/domain/errors/cannot-add-himself-to-group.error"
import { MinimumMembersForGroupNotReachedError } from "@/contexts/app/chats/domain/errors/minimun-members-for-group-not-reached.error"
import { UsersNotFoundToCreateGroupError } from "@/contexts/app/chats/domain/errors/users-not-found-to-create-group.error"
import { GroupCreatedEvent } from "@/contexts/app/chats/domain/events/group-created.event"
import { UserRepository } from "@/contexts/app/user/domain/contracts/user.repository"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { EventBus } from "@nestjs/cqrs"

type CreateGroupInput = {
  name: string
  description?: string | null
  memberIds: string[]
  ownerUserId: string
  payload?: Record<string, unknown>
}

@Injectable()
export class CreateGroupUseCase implements UseCase<CreateGroupInput, Group> {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: CreateGroupInput): Promise<Group> {
    if (input.memberIds.some(memberId => memberId === input.ownerUserId)) {
      throw new CannotAddHimselfToGroupError()
    }

    if (input.memberIds.length < 2) {
      throw new MinimumMembersForGroupNotReachedError()
    }

    const members = await this.userRepository.findByIds(input.memberIds)

    if (members.length !== input.memberIds.length) {
      throw new UsersNotFoundToCreateGroupError()
    }

    const group = await this.groupRepository.create(
      Group.create({
        name: input.name,
        description: input.description,
        members: [
          ...members.map(user =>
            GroupUser.create({
              userId: user.id
            })
          ),
          GroupUser.create({
            userId: input.ownerUserId
          })
        ]
      })
    )

    this.eventBus.publish(new GroupCreatedEvent(group, input.payload))

    return group
  }
}
