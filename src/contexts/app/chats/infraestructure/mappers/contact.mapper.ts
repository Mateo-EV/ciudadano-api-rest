import { Contact } from "@/contexts/app/chats/domain/entities/contact"
import { ContactMessage } from "@/contexts/app/chats/domain/entities/contact-message"
import type {
  Prisma,
  Contact as PrismaContact,
  ContactMessage as PrismaContactMessage
} from "@prisma/client"

export class ContactMapper {
  static prisma = {
    toDomain(prismaContact: PrismaContact): Contact {
      return Contact.create({
        id: prismaContact.id,
        created_at: prismaContact.created_at,
        from_user_id: prismaContact.from_id,
        to_user_id: prismaContact.to_id
      })
    },
    toCreate(contact: Contact): Prisma.ContactCreateArgs["data"] {
      return {
        id: contact.id,
        from_id: contact.from_user_id,
        to_id: contact.to_user_id,
        created_at: contact.created_at
      }
    },

    toMessageDomain(prismaMessage: PrismaContactMessage): ContactMessage {
      return ContactMessage.create({
        id: prismaMessage.id,
        contact_id: prismaMessage.contact_id,
        content: prismaMessage.content,
        createdAt: prismaMessage.created_at,
        sent_by_user_id: prismaMessage.user_id
      })
    },
    toMessageCreate(
      message: ContactMessage
    ): Prisma.ContactMessageCreateArgs["data"] {
      return {
        id: message.id,
        contact_id: message.contact_id,
        content: message.content,
        user_id: message.sent_by_user_id,
        created_at: message.createdAt
      }
    }
  }
}
