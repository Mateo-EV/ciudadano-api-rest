import { GetContactByIdUseCase } from "@/contexts/app/chats/application/use-cases/get-contact-by-id.use-case"
import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import { ContactMessage } from "@/contexts/app/chats/domain/entities/contact-message"
import { User } from "@/contexts/app/user/domain/entities/user"
import { CursorPaginated } from "@/utils/cursor-paginated"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type GetContactMessagesCursorPaginatedByContactIdInput = {
  contactId: string
  cursor?: string
  userOwner: User
}

@Injectable()
export class GetContactMessagesCursorPaginatedByContactIdUseCase
  implements
    UseCase<
      GetContactMessagesCursorPaginatedByContactIdInput,
      CursorPaginated<ContactMessage>
    >
{
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly getContactByIdUseCase: GetContactByIdUseCase
  ) {}

  async execute(
    input: GetContactMessagesCursorPaginatedByContactIdInput
  ): Promise<CursorPaginated<ContactMessage>> {
    const contact = await this.getContactByIdUseCase.execute({
      contactId: input.contactId,
      userOwnerId: input.userOwner.id
    })

    return await this.contactRepository.findMessagesCursorPaginatedByContact(
      contact,
      input.cursor
    )
  }
}
