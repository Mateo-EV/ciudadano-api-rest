import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import type { Contact } from "@/contexts/app/chats/domain/entities/contact"
import type { User } from "@/contexts/app/user/domain/entities/user"
import type { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type GetContactsByUserInput = {
  user: User
}

@Injectable()
export class GetContactsByUserUseCase
  implements UseCase<GetContactsByUserInput, Contact[]>
{
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(input: GetContactsByUserInput): Promise<Contact[]> {
    return this.contactRepository.findByUserId(input.user.id)
  }
}
