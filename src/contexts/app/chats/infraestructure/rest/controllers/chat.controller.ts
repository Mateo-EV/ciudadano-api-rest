import { GetContactMessagesCursorPaginatedByContactIdUseCase } from "@/contexts/app/chats/application/use-cases/get-contact-messages-cursor-paginated-by-contact-id.use-case"
import { GetGroupMessagesCursorPaginatedByGroupIdUseCase } from "@/contexts/app/chats/application/use-cases/get-group-messages-cursor-paginated-by-contact-id.use-case"
import { GetPossibleContactsByPhonesUseCase } from "@/contexts/app/chats/application/use-cases/get-possible-contacts-by-phones.use-case"
import { getPossibleContactsByPhonesRequestSchema } from "@/contexts/app/chats/infraestructure/rest/request/get-possible-contacts-by-phones-request.dto"
import { User } from "@/contexts/app/user/domain/entities/user"
import { ZodValidationPipe } from "@/lib/zod/zod-validation.pipe"
import { Controller, Get, Param, Query, Req } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"

@Controller("chats")
export class ChatController {
  constructor(
    protected readonly getPossibleContactsByPhonesUseCase: GetPossibleContactsByPhonesUseCase,
    protected readonly getContactMessagesCursorPaginatedByContactIdUseCase: GetContactMessagesCursorPaginatedByContactIdUseCase,
    protected readonly getGroupMessagesCursorPaginatedByGroupIdUseCase: GetGroupMessagesCursorPaginatedByGroupIdUseCase
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

    return { data: possibleContacts }
  }

  @Get("contacts/:contactId/messages")
  @ApiBearerAuth()
  async getContactMessagesCursorPaginatedByContactId(
    @Req() req: Express.Request,
    @Query("cursor") cursor: string,
    @Param("contactId") contactId: string
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

  @Get("groups/:groupId/messages")
  @ApiBearerAuth()
  async getGroupMessagesCursorPaginatedByGroupId(
    @Req() req: Express.Request,
    @Query("cursor") cursor: string,
    @Param("groupId") groupId: string
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
