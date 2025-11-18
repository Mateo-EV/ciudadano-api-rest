import { Message } from "@/contexts/app/chats/domain/entities/message"

export class ContactMessage extends Message {
  contact_id: string
  sent_by_user_id: string

  static create(props: Partial<ContactMessage>): ContactMessage {
    const contactMessage = new ContactMessage()
    Object.assign(contactMessage, props)
    return contactMessage
  }
}
