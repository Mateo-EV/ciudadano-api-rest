import { CannotAddHimselfToGroupError } from "@/contexts/app/chats/domain/errors/cannot-add-himself-to-group.error"
import { ContactAlreadyExistsWithTheUserError } from "@/contexts/app/chats/domain/errors/contact-already-exists-with-the-user.error"
import { ContactNotFoundError } from "@/contexts/app/chats/domain/errors/contact-not-found.error"
import { GroupNotFoundError } from "@/contexts/app/chats/domain/errors/group-not-found.error"
import { MinimumMembersForGroupNotReachedError } from "@/contexts/app/chats/domain/errors/minimun-members-for-group-not-reached.error"
import { UnauthorizedContactForUserError } from "@/contexts/app/chats/domain/errors/unauthorized-contact-for-user.error"
import { UnuauthorizedGroupForUserError } from "@/contexts/app/chats/domain/errors/unauthorized-group-for-user.error"
import { UserNotFoundToCreateContactError } from "@/contexts/app/chats/domain/errors/user-not-found-to-create-contact.error"
import { UserWithoutPhoneCannotHaveContactsError } from "@/contexts/app/chats/domain/errors/user-without-phone-cannot-have-contacts.error"
import { UsersNotFoundToCreateGroupError } from "@/contexts/app/chats/domain/errors/users-not-found-to-create-group.error"
import { ArgumentsHost, Catch } from "@nestjs/common"
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets"

@Catch(Error)
export class ChatExceptionWsFilter extends BaseWsExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    if (exception instanceof WsException) {
      super.catch(exception, host)
      return
    }

    let wsException: WsException | null = null

    if (exception instanceof CannotAddHimselfToGroupError) {
      wsException = new WsException(exception.message)
    } else if (exception instanceof ContactAlreadyExistsWithTheUserError) {
      wsException = new WsException(exception.message)
    } else if (exception instanceof ContactNotFoundError) {
      wsException = new WsException(exception.message)
    } else if (exception instanceof GroupNotFoundError) {
      wsException = new WsException(exception.message)
    } else if (exception instanceof MinimumMembersForGroupNotReachedError) {
      wsException = new WsException(exception.message)
    } else if (exception instanceof UnauthorizedContactForUserError) {
      wsException = new WsException(exception.message)
    } else if (exception instanceof UnuauthorizedGroupForUserError) {
      wsException = new WsException(exception.message)
    } else if (exception instanceof UserNotFoundToCreateContactError) {
      wsException = new WsException(exception.message)
    } else if (exception instanceof UserWithoutPhoneCannotHaveContactsError) {
      wsException = new WsException(exception.message)
    } else if (exception instanceof UsersNotFoundToCreateGroupError) {
      wsException = new WsException(exception.message)
    }

    super.catch(wsException ?? exception, host)
  }
}
