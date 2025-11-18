import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import { Contact } from "@/contexts/app/chats/domain/entities/contact"
import { ContactNotFoundError } from "@/contexts/app/chats/domain/errors/contact-not-found.error"
import { UnauthorizedContactForUserError } from "@/contexts/app/chats/domain/errors/unauthorized-contact-for-user.error"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type GetContactByIdInput = {
  contactId: string
  userOwnerId: string
}

@Injectable()
export class GetContactByIdUseCase
  implements UseCase<GetContactByIdInput, Contact>
{
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(input: GetContactByIdInput): Promise<Contact> {
    const contact = await this.contactRepository.findById(input.contactId)

    if (!contact) {
      throw new ContactNotFoundError()
    }

    if (
      contact.from_user_id !== input.userOwnerId &&
      contact.to_user_id !== input.userOwnerId
    ) {
      throw new UnauthorizedContactForUserError()
    }

    return contact
  }
}
