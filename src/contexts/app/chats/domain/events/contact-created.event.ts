import type { Contact } from "@/contexts/app/chats/domain/entities/contact"

export class ContactCreatedEvent {
  constructor(public readonly contactCreated: Contact) {}
}
