import { GroupRepository } from "@/contexts/app/chats/domain/contracts/group.repository"
import { Group } from "@/contexts/app/chats/domain/entities/group"
import { GroupMessage } from "@/contexts/app/chats/domain/entities/group-message"
import { MessageSentEvent } from "@/contexts/app/chats/domain/events/message-sent.event"
import { User } from "@/contexts/app/user/domain/entities/user"
import { generateId } from "@/utils/id-generator"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { EventBus } from "@nestjs/cqrs"

type SendMessageToGroupInput = {
  message: string
  group: Group
  userSender: User
  payload?: Record<string, unknown>
}

@Injectable()
export class SendMessageToGroupUseCase
  implements UseCase<SendMessageToGroupInput, GroupMessage>
{
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: SendMessageToGroupInput): Promise<GroupMessage> {
    const groupMessage = GroupMessage.create({
      id: generateId(),
      content: input.message,
      groupId: input.group.id,
      senderId: input.userSender.id,
      createdAt: new Date()
    })

    const userIdsToNotify = input.group.members
      .map(member => member.userId)
      .filter(userId => userId !== input.userSender.id)

    this.eventBus.publish(
      new MessageSentEvent(
        groupMessage,
        userIdsToNotify,
        input.userSender,
        input.payload
      )
    )

    return await this.groupRepository.createMessage(groupMessage)
  }
}
