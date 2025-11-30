import { ContactMessage } from "@/contexts/app/chats/domain/entities/contact-message"
import { GroupMessage } from "@/contexts/app/chats/domain/entities/group-message"
import { MessageSentEvent } from "@/contexts/app/chats/domain/events/message-sent.event"
import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { Socket } from "socket.io"

@EventsHandler(MessageSentEvent)
export class MessageSentHandler implements IEventHandler<MessageSentEvent> {
  handle(event: MessageSentEvent) {
    const message = event.message

    const socketClient = event.payload?.socketClient
    if (!(socketClient instanceof Socket)) {
      return
    }

    if (message instanceof ContactMessage) {
      // socketClient.broadcast
      //   .to(`chat_contact:${message.contact_id}`)
      //   .emit("chat_contact:message_sent", {
      //     contact_message: message
      //   })
      event.userIdsToNotify.forEach(userId => {
        socketClient.broadcast
          .to(`user:${userId}`)
          .emit("chat_contact:message_sent", {
            contact_message: message
          })
      })
    }

    if (message instanceof GroupMessage) {
      // socketClient.broadcast
      //   .to(`chat_group:${message.groupId}`)
      //   .emit("chat_group:message_sent", {
      //     group_message: message
      //   })
      event.userIdsToNotify.forEach(userId => {
        socketClient.broadcast
          .to(`user:${userId}`)
          .emit("chat_group:message_sent", {
            group_message: message
          })
      })
    }
  }
}
