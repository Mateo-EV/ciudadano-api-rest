import { Message } from "@/contexts/app/chats/domain/entities/message"

export class GroupMessage extends Message {
  groupId: string
  senderId: string

  static create(props: Partial<GroupMessage>): GroupMessage {
    const groupMessage = new GroupMessage()
    Object.assign(groupMessage, props)
    return groupMessage
  }
}
