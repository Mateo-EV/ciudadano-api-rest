import { AddContactUseCase } from "@/contexts/app/chats/application/use-cases/add-contact.use-case"
import { GetContactByIdUseCase } from "@/contexts/app/chats/application/use-cases/get-contact-by-id.use-case"
import { GetPossibleContactsByPhoneUseCase } from "@/contexts/app/chats/application/use-cases/get-possible-contacts-by-phone.use-case"
import { SendMessageToContactUseCase } from "@/contexts/app/chats/application/use-cases/send-message-to-contact.use-case"
import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import { ContactCreatedHandler } from "@/contexts/app/chats/infraestructure/handlers/contact-created.handler"
import { MessageSentHandler } from "@/contexts/app/chats/infraestructure/handlers/message-sent.handler"
import { PrismaContactRepository } from "@/contexts/app/chats/infraestructure/repositories/prisma-contact.repository"
import { ChatGateway } from "@/contexts/app/chats/infraestructure/ws/gateways/chat.gateway"
import { Module } from "@nestjs/common"

@Module({
  providers: [
    // USECASES
    AddContactUseCase,
    GetContactByIdUseCase,
    GetPossibleContactsByPhoneUseCase,
    SendMessageToContactUseCase,
    // CONTRACTS
    { provide: ContactRepository, useClass: PrismaContactRepository },
    // WS GATEWAYS
    ChatGateway,
    // HANDLERS
    ContactCreatedHandler,
    MessageSentHandler
  ]
})
export class ChatModule {}
