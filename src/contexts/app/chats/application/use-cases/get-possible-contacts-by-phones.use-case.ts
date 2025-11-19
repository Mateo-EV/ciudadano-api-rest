import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import { Contact } from "@/contexts/app/chats/domain/entities/contact"
import { User } from "@/contexts/app/user/domain/entities/user"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type GetPossibleContactsByPhonesInput = {
  phones: string[]
  userSearching: User
}

type GetPossibleContactsByPhonesOutput = Contact[]

@Injectable()
export class GetPossibleContactsByPhonesUseCase
  implements
    UseCase<GetPossibleContactsByPhonesInput, GetPossibleContactsByPhonesOutput>
{
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(
    input: GetPossibleContactsByPhonesInput
  ): Promise<GetPossibleContactsByPhonesOutput> {
    const possiblesUserContacts =
      await this.contactRepository.findPossibleContactsByPhones(
        input.phones,
        input.userSearching.id
      )

    return possiblesUserContacts
  }
}
