import { ContactCreatedEvent } from "@/contexts/app/chats/domain/events/contact-created.event"
import { ChatGateway } from "@/contexts/app/chats/infraestructure/ws/gateways/chat.gateway"
import { EventsHandler, IEventHandler } from "@nestjs/cqrs"

@EventsHandler(ContactCreatedEvent)
export class ContactCreatedHandler
  implements IEventHandler<ContactCreatedEvent>
{
  constructor(private readonly chatGateway: ChatGateway) {}

  handle(event: ContactCreatedEvent) {
    const contact = event.contactCreated

    this.chatGateway.server
      .to(`user:${contact.to_user_id}`)
      .emit("chat_contact:added", { contact })
  }
}
