import { GetContactMessagesCursorPaginatedByContactIdUseCase } from "@/contexts/app/chats/application/use-cases/get-contact-messages-cursor-paginated-by-contact-id.use-case"
import { GetGroupMessagesCursorPaginatedByGroupIdUseCase } from "@/contexts/app/chats/application/use-cases/get-group-messages-cursor-paginated-by-contact-id.use-case"
import { GetGroupsByUserUseCase } from "@/contexts/app/chats/application/use-cases/get-groups-by-user.use-case"
import { GetPossibleContactsByPhonesUseCase } from "@/contexts/app/chats/application/use-cases/get-possible-contacts-by-phones.use-case"
import { ChatExceptionFilter } from "@/contexts/app/chats/infraestructure/rest/filter/chat-exception.filter"
import { getPossibleContactsByPhonesRequestSchema } from "@/contexts/app/chats/infraestructure/rest/request/get-possible-contacts-by-phones-request.dto"
import { User } from "@/contexts/app/user/domain/entities/user"
import { ZodValidationPipe } from "@/lib/zod/zod-validation.pipe"
import { Controller, Get, Param, Query, Req, UseFilters } from "@nestjs/common"
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger"

@Controller("chats")
@UseFilters(ChatExceptionFilter)
export class ChatController {
  constructor(
    protected readonly getPossibleContactsByPhonesUseCase: GetPossibleContactsByPhonesUseCase,
    protected readonly getContactMessagesCursorPaginatedByContactIdUseCase: GetContactMessagesCursorPaginatedByContactIdUseCase,
    protected readonly getGroupMessagesCursorPaginatedByGroupIdUseCase: GetGroupMessagesCursorPaginatedByGroupIdUseCase,
    protected readonly getGroupsByUserUseCase: GetGroupsByUserUseCase
  ) {}

  @Get("possible-contacts")
  @ApiBearerAuth()
  async getPossibleContactsByPhones(
    @Query(
      "phones",
      new ZodValidationPipe(getPossibleContactsByPhonesRequestSchema)
    )
    phones: string[],
    @Req() req: Express.Request
  ) {
    const user = req.user as User

    const possibleContacts =
      await this.getPossibleContactsByPhonesUseCase.execute({
        phones,
        userSearching: user
      })

    return {
      data: possibleContacts.map(contact => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone
      }))
    }
  }

  @Get("contacts/:contactId/messages")
  @ApiBearerAuth()
  @ApiQuery({ name: "cursor", required: false })
  async getContactMessagesCursorPaginatedByContactId(
    @Req() req: Express.Request,
    @Param("contactId") contactId: string,
    @Query("cursor") cursor?: string
  ) {
    const user = req.user as User

    const contactMessages =
      await this.getContactMessagesCursorPaginatedByContactIdUseCase.execute({
        contactId,
        cursor,
        userOwner: user
      })

    return { data: contactMessages }
  }

  @Get("groups/me")
  @ApiBearerAuth()
  async getGroupsByUser(@Req() req: Express.Request) {
    const user = req.user as User

    const groups = await this.getGroupsByUserUseCase.execute({
      user
    })

    return { data: groups }
  }

  @Get("groups/:groupId/messages")
  @ApiBearerAuth()
  @ApiQuery({ name: "cursor", required: false })
  async getGroupMessagesCursorPaginatedByGroupId(
    @Req() req: Express.Request,
    @Param("groupId") groupId: string,
    @Query("cursor") cursor?: string | null
  ) {
    const user = req.user as User
    const groupMessages =
      await this.getGroupMessagesCursorPaginatedByGroupIdUseCase.execute({
        groupId,
        cursor,
        userOwner: user
      })
    return { data: groupMessages }
  }
}
