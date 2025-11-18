import { GroupCreatedEvent } from "@/contexts/app/chats/domain/events/group-created.event"
import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { Socket } from "socket.io"

@EventsHandler(GroupCreatedEvent)
export class GroupCreatedHandler implements IEventHandler<GroupCreatedEvent> {
  handle(event: GroupCreatedEvent) {
    const group = event.groupCreated

    const socketClient = event.payload?.socketClient
    if (!(socketClient instanceof Socket)) {
      return
    }

    group.members.forEach(member => {
      socketClient.broadcast
        .to(`user:${member.userId}`)
        .emit("chat_group:added", { group })
    })
  }
}
