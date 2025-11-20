import {
  type AuthenticatedSocket,
  ValidateUserIsAuthenticatedInWsHelper
} from "@/contexts/app/auth/infrastructure/ws/helper/validate-user-is-authenticated-in-ws.helper"
import { AddContactUseCase } from "@/contexts/app/chats/application/use-cases/add-contact.use-case"
import { CreateGroupUseCase } from "@/contexts/app/chats/application/use-cases/create-group.use-case"
import { GetContactByIdUseCase } from "@/contexts/app/chats/application/use-cases/get-contact-by-id.use-case"
import { GetGroupByIdUseCase } from "@/contexts/app/chats/application/use-cases/get-group-by-id.use-case"
import { SendMessageToContactUseCase } from "@/contexts/app/chats/application/use-cases/send-message-to-contact.use-case"
import { SendMessageToGroupUseCase } from "@/contexts/app/chats/application/use-cases/send-message-to-group.use-case"
import { Contact } from "@/contexts/app/chats/domain/entities/contact"
import { Group } from "@/contexts/app/chats/domain/entities/group"
import { ChatExceptionWsFilter } from "@/contexts/app/chats/infraestructure/ws/filter/chat-exception-ws.filter"
import {
  addContactSchema,
  AddContactSchemaDto
} from "@/contexts/app/chats/infraestructure/ws/schemas/add-contact-schema.dto"
import {
  createGroupSchema,
  CreateGroupSchemaDto
} from "@/contexts/app/chats/infraestructure/ws/schemas/create-group-schema.dto"
import {
  sendMessageSchema,
  SendMessageSchemaDto
} from "@/contexts/app/chats/infraestructure/ws/schemas/send-message-schema.dto"
import { ZodWsValidationPipe } from "@/lib/zod/zod-ws-validation.pipe"
import { UseFilters } from "@nestjs/common"
import {
  Ack,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from "@nestjs/websockets"
import { from, map } from "rxjs"
import { Server, Socket } from "socket.io"

type JoinedChatRoomSocket = AuthenticatedSocket & {
  payload: {
    chat: Contact | Group
  }
}

@WebSocketGateway({ namespace: "chats" })
@UseFilters(ChatExceptionWsFilter)
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly validateUserIsAuthenticatedInWsHelper: ValidateUserIsAuthenticatedInWsHelper,
    private readonly addContactUseCase: AddContactUseCase,
    private readonly sendMessageToContactUseCase: SendMessageToContactUseCase,
    private readonly getContactByIdUseCase: GetContactByIdUseCase,
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly getGroupByIdUseCase: GetGroupByIdUseCase,
    private readonly sendMessageToGroupUseCase: SendMessageToGroupUseCase
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    await this.validateUserIsAuthenticatedInWsHelper.validate(client)

    const clientAuthenticated = client as AuthenticatedSocket

    await clientAuthenticated.join(`user:${clientAuthenticated.user.id}`)
  }

  @WebSocketServer()
  server: Server

  @SubscribeMessage("chat_contact:add")
  handleAddContact(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody(new ZodWsValidationPipe(addContactSchema))
    data: AddContactSchemaDto
  ) {
    return from(
      this.addContactUseCase.execute({
        userContactId: data.user_contact_id,
        userOwner: client.user,
        payload: { socketClient: client }
      })
    ).pipe(
      map(contact => ({
        message: "Contacto agregado exitosamente",
        data: contact
      }))
    )
  }

  @SubscribeMessage("chat_contact:join")
  async handleJoinContactRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody("contact_id") contactId: string
  ) {
    if ((client as JoinedChatRoomSocket).payload?.chat) {
      const previousChatId = (client as JoinedChatRoomSocket).payload.chat.id
      await client.leave(`chat_contact:${previousChatId}`)
    }

    const contact = await this.getContactByIdUseCase.execute({
      contactId: contactId,
      userOwnerId: client.user.id
    })

    await client.join(`chat_contact:${contact.id}`)

    Object.assign(client, {
      payload: { chat: contact, ...client.payload }
    }) as JoinedChatRoomSocket

    return {
      message: "Te has unido a la sala del contacto",
      data: contact
    }
  }

  @SubscribeMessage("chat_contact:leave")
  async handleLeaveContactRoom(
    @ConnectedSocket() client: JoinedChatRoomSocket
  ) {
    if (!client.payload.chat) {
      throw new WsException("No estás en una sala de contacto")
    }

    if (client.payload.chat instanceof Contact) {
      await client.leave(`chat_contact:${client.payload.chat.id}`)
    }

    return {
      message: "Has salido de la sala del contacto"
    }
  }

  @SubscribeMessage("chat_contact:send_message")
  handleSendContactMessage(
    @ConnectedSocket() client: JoinedChatRoomSocket,
    @MessageBody(new ZodWsValidationPipe(sendMessageSchema))
    data: SendMessageSchemaDto
  ) {
    if (!client.payload.chat || !(client.payload.chat instanceof Contact)) {
      throw new WsException("Debes unirte a una sala de contacto primero")
    }

    return from(
      this.sendMessageToContactUseCase.execute({
        contact: client.payload.chat,
        message: data.message,
        userSender: client.user,
        payload: {
          socketClient: client
        }
      })
    ).pipe(
      map(contactMessage => ({
        message: "Mensaje enviado exitosamente",
        data: contactMessage
      }))
    )
  }

  @SubscribeMessage("chat_group:create")
  async handleCreateGroup(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody(new ZodWsValidationPipe(createGroupSchema))
    data: CreateGroupSchemaDto,
    @Ack() ack: (response: any) => void
  ) {
    const group = await this.createGroupUseCase.execute({
      ownerUserId: client.user.id,
      payload: { socketClient: client },
      name: data.name,
      description: data.description,
      memberIds: data.memberIds
    })

    ack({
      message: "Grupo agregado exitosamente",
      data: group
    })
  }

  @SubscribeMessage("chat_group:send_message")
  handleSendChatMessage(
    @ConnectedSocket() client: JoinedChatRoomSocket,
    @MessageBody(new ZodWsValidationPipe(sendMessageSchema))
    data: SendMessageSchemaDto
  ) {
    console.log(data)

    if (!client.payload.chat || !(client.payload.chat instanceof Group)) {
      throw new WsException("Debes unirte a una sala de grupo primero")
    }

    return from(
      this.sendMessageToGroupUseCase.execute({
        group: client.payload.chat,
        message: data.message,
        userSender: client.user,
        payload: {
          socketClient: client
        }
      })
    ).pipe(
      map(chatMessage => ({
        message: "Mensaje enviado exitosamente",
        data: {
          ...chatMessage,
          sender: {
            id: client.user.id,
            firstName: client.user.firstName,
            lastName: client.user.lastName,
            phone: client.user.phone
          }
        }
      }))
    )
  }

  @SubscribeMessage("chat_group:join")
  async handleJoinGroupRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody("group_id") groupId: string
  ) {
    if ((client as JoinedChatRoomSocket).payload?.chat) {
      const previousChatId = (client as JoinedChatRoomSocket).payload.chat.id
      await client.leave(`chat_group:${previousChatId}`)
    }

    const group = await this.getGroupByIdUseCase.execute({
      groupId: groupId,
      userOwnerId: client.user.id
    })
    await client.join(`chat_group:${group.id}`)

    console.log(groupId)

    Object.assign(client, {
      payload: { chat: group, ...client.payload }
    }) as JoinedChatRoomSocket

    console.log(groupId)
    return {
      message: "Te has unido a la sala del grupo",
      data: group
    }
  }

  @SubscribeMessage("chat_group:leave")
  async handleLeaveGroupRoom(@ConnectedSocket() client: JoinedChatRoomSocket) {
    console.log("leyendo grupo", client.payload.chat)
    if (!client.payload.chat) {
      throw new WsException("No estás en una sala de grupo")
    }

    console.log("leyendo grupo", client.payload.chat)

    if (client.payload.chat instanceof Group) {
      await client.leave(`chat_group:${client.payload.chat.id}`)
    }

    return {
      message: "Has salido de la sala del grupo"
    }
  }
}
