import { Message } from "@/contexts/app/chats/domain/entities/message"

export class GroupMessage extends Message {
  group_id: string
  sender_id: string

  static create(props: Partial<GroupMessage>): GroupMessage {
    const groupMessage = new GroupMessage()
    Object.assign(groupMessage, props)
    return groupMessage
  }
}
