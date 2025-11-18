import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import { Contact } from "@/contexts/app/chats/domain/entities/contact"
import { ContactMessage } from "@/contexts/app/chats/domain/entities/contact-message"
import { MessageSentEvent } from "@/contexts/app/chats/domain/events/message-sent.event"
import { User } from "@/contexts/app/user/domain/entities/user"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { EventBus } from "@nestjs/cqrs"

type SendMessageToContactInput = {
  contact: Contact
  message: string
  userSender: User
  payload?: Record<string, unknown>
}

@Injectable()
export class SendMessageToContactUseCase
  implements UseCase<SendMessageToContactInput, ContactMessage>
{
  constructor(
    private readonly contactRepository: ContactRepository,
    private eventBus: EventBus
  ) {}

  async execute(input: SendMessageToContactInput): Promise<ContactMessage> {
    const contactMessage = ContactMessage.create({
      contact_id: input.contact.id,
      content: input.message,
      sent_by_user_id: input.userSender.id
    })

    const sendToUserId =
      input.contact.from_user_id === input.userSender.id
        ? input.contact.to_user_id
        : input.contact.from_user_id

    this.eventBus.publish(
      new MessageSentEvent(contactMessage, sendToUserId, input.payload)
    )

    return await this.contactRepository.createMessage(contactMessage)
  }
}
