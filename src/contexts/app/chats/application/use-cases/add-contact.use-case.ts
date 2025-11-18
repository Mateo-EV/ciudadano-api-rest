import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import { Contact } from "@/contexts/app/chats/domain/entities/contact"
import { ContactAlreadyExistsWithTheUserError } from "@/contexts/app/chats/domain/errors/contact-already-exists-with-the-user.error"
import { UserNotFoundToCreateContactError } from "@/contexts/app/chats/domain/errors/user-not-found-to-create-contact.error"
import { ContactCreatedEvent } from "@/contexts/app/chats/domain/events/contact-created.event"
import { UserRepository } from "@/contexts/app/user/domain/contracts/user.repository"
import { User } from "@/contexts/app/user/domain/entities/user"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { EventBus } from "@nestjs/cqrs"

type AddContactInput = {
  userContactId: string
  userOwner: User
}

@Injectable()
export class AddContactUseCase implements UseCase<AddContactInput, Contact> {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: AddContactInput): Promise<Contact> {
    if (input.userContactId === input.userOwner.id) {
      throw new ContactAlreadyExistsWithTheUserError()
    }

    const userContact = await this.userRepository.findById(input.userContactId)

    if (!userContact) {
      throw new UserNotFoundToCreateContactError()
    }

    const existsContactBetweenUsers =
      await this.contactRepository.existsBetweenUserIds(
        input.userOwner.id,
        userContact.id
      )

    if (existsContactBetweenUsers) {
      throw new ContactAlreadyExistsWithTheUserError()
    }

    const contactCreated = await this.contactRepository.create(
      Contact.create({
        from_user_id: input.userOwner.id,
        to_user_id: userContact.id
      })
    )

    this.eventBus.publish(new ContactCreatedEvent(contactCreated))

    return contactCreated
  }
}
