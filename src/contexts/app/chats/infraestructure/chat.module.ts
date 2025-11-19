import { AddContactUseCase } from "@/contexts/app/chats/application/use-cases/add-contact.use-case"
import { CreateGroupUseCase } from "@/contexts/app/chats/application/use-cases/create-group.use-case"
import { GetContactByIdUseCase } from "@/contexts/app/chats/application/use-cases/get-contact-by-id.use-case"
import { GetContactMessagesCursorPaginatedByContactIdUseCase } from "@/contexts/app/chats/application/use-cases/get-contact-messages-cursor-paginated-by-contact-id.use-case"
import { GetGroupByIdUseCase } from "@/contexts/app/chats/application/use-cases/get-group-by-id.use-case"
import { GetGroupMessagesCursorPaginatedByGroupIdUseCase } from "@/contexts/app/chats/application/use-cases/get-group-messages-cursor-paginated-by-contact-id.use-case"
import { GetPossibleContactsByPhonesUseCase } from "@/contexts/app/chats/application/use-cases/get-possible-contacts-by-phones.use-case"
import { SendMessageToContactUseCase } from "@/contexts/app/chats/application/use-cases/send-message-to-contact.use-case"
import { SendMessageToGroupUseCase } from "@/contexts/app/chats/application/use-cases/send-message-to-group.use-case"
import { ContactRepository } from "@/contexts/app/chats/domain/contracts/contact.repository"
import { GroupRepository } from "@/contexts/app/chats/domain/contracts/group.repository"
import { ContactCreatedHandler } from "@/contexts/app/chats/infraestructure/handlers/contact-created.handler"
import { GroupCreatedHandler } from "@/contexts/app/chats/infraestructure/handlers/group-created-handler"
import { MessageSentHandler } from "@/contexts/app/chats/infraestructure/handlers/message-sent.handler"
import { PrismaContactRepository } from "@/contexts/app/chats/infraestructure/repositories/prisma-contact.repository"
import { PrismaGroupRepository } from "@/contexts/app/chats/infraestructure/repositories/prisma-group.repository"
import { ChatController } from "@/contexts/app/chats/infraestructure/rest/controllers/chat.controller"
import { ChatGateway } from "@/contexts/app/chats/infraestructure/ws/gateways/chat.gateway"
import { Module } from "@nestjs/common"

@Module({
  providers: [
    // USECASES
    AddContactUseCase,
    GetContactByIdUseCase,
    GetPossibleContactsByPhonesUseCase,
    SendMessageToContactUseCase,
    CreateGroupUseCase,
    GetGroupByIdUseCase,
    SendMessageToGroupUseCase,
    GetContactMessagesCursorPaginatedByContactIdUseCase,
    GetGroupMessagesCursorPaginatedByGroupIdUseCase,
    // CONTRACTS
    { provide: ContactRepository, useClass: PrismaContactRepository },
    { provide: GroupRepository, useClass: PrismaGroupRepository },
    // WS GATEWAYS
    ChatGateway,
    // HANDLERS
    ContactCreatedHandler,
    MessageSentHandler,
    GroupCreatedHandler
  ],
  controllers: [ChatController]
})
export class ChatModule {}
