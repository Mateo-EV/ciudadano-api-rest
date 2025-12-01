import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import { Contact } from "@/contexts/app/chats/domain/entities/contact"
import { ContactMessage } from "@/contexts/app/chats/domain/entities/contact-message"
import { MessageSentEvent } from "@/contexts/app/chats/domain/events/message-sent.event"
import { User } from "@/contexts/app/user/domain/entities/user"
import { generateId } from "@/utils/id-generator"
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
      id: generateId(),
      contact_id: input.contact.id,
      content: input.message,
      sent_by_user_id: input.userSender.id,
      createdAt: new Date(),
      sender: {
        id: input.userSender.id,
        firstName: input.userSender.firstName,
        lastName: input.userSender.lastName,
        phone: input.userSender.phone ?? ""
      }
    })

    this.eventBus.publish(
      new MessageSentEvent(
        contactMessage,
        [input.contact.from_user_id, input.contact.to_user_id],
        input.userSender,
        input.payload
      )
    )

    return await this.contactRepository.createMessage(contactMessage)
  }
}
