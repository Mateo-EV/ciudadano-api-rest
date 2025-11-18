import type { Contact } from "@/contexts/app/chats/domain/entities/contact"
import type { ContactMessage } from "@/contexts/app/chats/domain/entities/contact-message"
import type { CursorPaginated } from "@/utils/cursor-paginated"

export abstract class ContactRepository {
  abstract create(contact: Contact): Promise<Contact>
  abstract findByUserId(userId: string): Promise<Contact[]>
  abstract findPossibleContactsByPhones(
    phones: string[],
    userSearchingId: string
  ): Promise<Contact[]>
  abstract createMessage(message: ContactMessage): Promise<ContactMessage>
  abstract findMessagesCursorPaginatedByContact(
    contact: Contact,
    cursor?: string
  ): Promise<CursorPaginated<ContactMessage>>
  abstract existsBetweenUserIds(
    userAId: string,
    userBId: string
  ): Promise<boolean>
  abstract findById(contactId: string): Promise<Contact | null>
}
