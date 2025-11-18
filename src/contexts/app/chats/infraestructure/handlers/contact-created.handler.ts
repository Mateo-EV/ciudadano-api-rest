import { ContactCreatedEvent } from "@/contexts/app/chats/domain/events/contact-created.event"
import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { Socket } from "socket.io"

@EventsHandler(ContactCreatedEvent)
export class ContactCreatedHandler
  implements IEventHandler<ContactCreatedEvent>
{
  handle(event: ContactCreatedEvent) {
    const contact = event.contactCreated

    const socketClient = event.payload?.socketClient
    if (!(socketClient instanceof Socket)) {
      return
    }

    socketClient.broadcast
      .to(`user:${contact.to_user_id}`)
      .emit("chat_contact:added", { contact })
  }
}
