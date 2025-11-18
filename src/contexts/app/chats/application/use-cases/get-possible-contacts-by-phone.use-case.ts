import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import { Contact } from "@/contexts/app/chats/domain/entities/contact"
import { User } from "@/contexts/app/user/domain/entities/user"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type GetPossibleContactsByPhoneInput = {
  phones: string[]
  userSearching: User
}

type GetPossibleContactsByPhoneOutput = Contact[]

@Injectable()
export class GetPossibleContactsByPhoneUseCase
  implements
    UseCase<GetPossibleContactsByPhoneInput, GetPossibleContactsByPhoneOutput>
{
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(
    input: GetPossibleContactsByPhoneInput
  ): Promise<GetPossibleContactsByPhoneOutput> {
    const possiblesUserContacts =
      await this.contactRepository.findPossibleContactsByPhones(
        input.phones,
        input.userSearching.id
      )

    return possiblesUserContacts
  }
}
