import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import { Contact } from "@/contexts/app/chats/domain/entities/contact"
import { ContactMessage } from "@/contexts/app/chats/domain/entities/contact-message"
import { ContactMapper } from "@/contexts/app/chats/infraestructure/mappers/contact.mapper"
import { PrismaService } from "@/lib/db/prisma.service"
import { CursorPaginated } from "@/utils/cursor-paginated"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaContactRepository implements ContactRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(contact: Contact): Promise<Contact> {
    const prismaCreatedContact = await this.prismaService.contact.create({
      data: ContactMapper.prisma.toCreate(contact)
    })

    return ContactMapper.prisma.toDomain(prismaCreatedContact)
  }

  async createMessage(message: ContactMessage): Promise<ContactMessage> {
    const prismaCreatedMessage = await this.prismaService.contactMessage.create(
      {
        data: ContactMapper.prisma.toMessageCreate(message)
      }
    )

    return ContactMapper.prisma.toMessageDomain(prismaCreatedMessage)
  }

  async existsBetweenUserIds(
    userAId: string,
    userBId: string
  ): Promise<boolean> {
    const contactCount = await this.prismaService.contact.count({
      where: {
        OR: [
          { from_id: userAId, to_id: userBId },
          { from_id: userBId, to_id: userAId }
        ]
      }
    })

    return contactCount > 0
  }

  async findByUserId(userId: string): Promise<Contact[]> {
    const prismaContacts = await this.prismaService.contact.findMany({
      where: {
        OR: [{ from_id: userId }, { to_id: userId }]
      }
    })

    return prismaContacts.map(prismaContact =>
      ContactMapper.prisma.toDomain(prismaContact)
    )
  }

  async findMessagesCursorPaginatedByContact(
    contact: Contact,
    cursor?: string | null
  ): Promise<CursorPaginated<ContactMessage>> {
    const prismaContactMessages =
      await this.prismaService.contactMessage.findMany({
        where: { contact_id: contact.id },
        cursor: cursor ? { id: cursor } : undefined,
        take: 10 + 1,
        orderBy: { created_at: "desc" }
      })

    const hasMore = prismaContactMessages.length > 10
    let nextCursor: string | undefined = undefined
    if (hasMore) {
      const nextItem = prismaContactMessages.pop()
      nextCursor = nextItem?.id
    }

    return {
      items: prismaContactMessages.map(prismaContactMessage =>
        ContactMapper.prisma.toMessageDomain(prismaContactMessage)
      ),
      nextCursor: nextCursor ?? null
    }
  }

  async findById(contactId: string): Promise<Contact | null> {
    const prismaContact = await this.prismaService.contact.findUnique({
      where: { id: contactId }
    })

    if (!prismaContact) {
      return null
    }

    return ContactMapper.prisma.toDomain(prismaContact)
  }
}
