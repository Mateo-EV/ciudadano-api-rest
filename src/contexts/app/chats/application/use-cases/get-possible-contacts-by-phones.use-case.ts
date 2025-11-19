import { UserRepository } from "@/contexts/app/user/domain/contracts/user.repository"
import { User } from "@/contexts/app/user/domain/entities/user"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type GetPossibleContactsByPhonesInput = {
  phones: string[]
  userSearching: User
}

type GetPossibleContactsByPhonesOutput = User[]

@Injectable()
export class GetPossibleContactsByPhonesUseCase
  implements
    UseCase<GetPossibleContactsByPhonesInput, GetPossibleContactsByPhonesOutput>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    input: GetPossibleContactsByPhonesInput
  ): Promise<GetPossibleContactsByPhonesOutput> {
    const possiblesUserContacts =
      await this.userRepository.findPossibleContactsByPhones(
        input.phones,
        input.userSearching.id
      )

    return possiblesUserContacts
  }
}
