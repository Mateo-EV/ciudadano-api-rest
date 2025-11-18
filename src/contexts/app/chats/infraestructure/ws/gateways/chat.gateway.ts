import {
  type AuthenticatedSocket,
  ValidateUserIsAuthenticatedInWsHelper
} from "@/contexts/app/auth/infrastructure/ws/helper/validate-user-is-authenticated-in-ws.helper"
import { AddContactUseCase } from "@/contexts/app/chats/application/use-cases/add-contact.use-case"
import { GetContactByIdUseCase } from "@/contexts/app/chats/application/use-cases/get-contact-by-id.use-case"
import { SendMessageToContactUseCase } from "@/contexts/app/chats/application/use-cases/send-message-to-contact.use-case"
import { Contact } from "@/contexts/app/chats/domain/entities/contact"
import {
  AddContactSchemaDto,
  addContactSchemaDto
} from "@/contexts/app/chats/infraestructure/ws/schemas/add-contact-schema.dto"
import {
  SendMessageToContactSchemaDto,
  sendMessageToContactSchemaDto
} from "@/contexts/app/chats/infraestructure/ws/schemas/send-message-to-contact-schema.dto"
import { ChatExceptionFilter } from "@/contexts/app/chats/infraestructure/ws/filter/chat-exception-ws.filter"
import { ZodWsValidationPipe } from "@/lib/zod/zod-ws-validation.pipe"
import { UseFilters } from "@nestjs/common"
import {
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

type JoinedContactRoomSocket = AuthenticatedSocket & {
  payload: {
    contact: Contact
  }
}

@WebSocketGateway({ namespace: "chats" })
@UseFilters(ChatExceptionFilter)
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly validateUserIsAuthenticatedInWsHelper: ValidateUserIsAuthenticatedInWsHelper,
    private readonly addContactUseCase: AddContactUseCase,
    private readonly sendMessageToContactUseCase: SendMessageToContactUseCase,
    private readonly getContactByIdUseCase: GetContactByIdUseCase
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
    @MessageBody(new ZodWsValidationPipe(addContactSchemaDto))
    data: AddContactSchemaDto
  ) {
    return from(
      this.addContactUseCase.execute({
        userContactId: data.user_contact_id,
        userOwner: client.user
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
    if ((client as JoinedContactRoomSocket).payload?.contact) {
      const previousContactId = (client as JoinedContactRoomSocket).payload
        .contact.id
      await client.leave(`contact:${previousContactId}`)
    }

    const contact = await this.getContactByIdUseCase.execute({
      contactId: contactId,
      userOwnerId: client.user.id
    })

    await client.join(`chat_contact:${contact.id}`)

    Object.assign(client, {
      payload: { contact, ...client.payload }
    }) as JoinedContactRoomSocket

    return {
      message: "Te has unido a la sala del contacto",
      data: contact
    }
  }

  @SubscribeMessage("chat_contact:leave")
  async handleLeaveContactRoom(
    @ConnectedSocket() client: JoinedContactRoomSocket
  ) {
    if (!client.payload.contact) {
      throw new WsException("No estás en una sala de contacto")
    }

    await client.leave(`contact:${client.payload.contact.id}`)

    return {
      message: "Has salido de la sala del contacto"
    }
  }

  @SubscribeMessage("chat_contact:send_message")
  handleSendContactMessage(
    @ConnectedSocket() client: JoinedContactRoomSocket,
    @MessageBody(new ZodWsValidationPipe(sendMessageToContactSchemaDto))
    data: SendMessageToContactSchemaDto
  ) {
    if (!client.payload.contact) {
      throw new WsException("Debes unirte a una sala de contacto primero")
    }

    return from(
      this.sendMessageToContactUseCase.execute({
        contact: client.payload.contact,
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
}
