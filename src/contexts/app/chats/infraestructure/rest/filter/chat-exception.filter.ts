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
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ForbiddenException,
  HttpException,
  NotFoundException
} from "@nestjs/common"
import { BaseExceptionFilter } from "@nestjs/core"

@Catch(Error)
export class ChatExceptionFilter extends BaseExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      super.catch(exception, host)
      return
    }

    let httpException: HttpException | null = null

    if (exception instanceof CannotAddHimselfToGroupError) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof ContactAlreadyExistsWithTheUserError) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof ContactNotFoundError) {
      httpException = new NotFoundException(exception.message)
    } else if (exception instanceof GroupNotFoundError) {
      httpException = new NotFoundException(exception.message)
    } else if (exception instanceof MinimumMembersForGroupNotReachedError) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof UnauthorizedContactForUserError) {
      httpException = new ForbiddenException(exception.message)
    } else if (exception instanceof UnuauthorizedGroupForUserError) {
      httpException = new ForbiddenException(exception.message)
    } else if (exception instanceof UserNotFoundToCreateContactError) {
      httpException = new NotFoundException(exception.message)
    } else if (exception instanceof UserWithoutPhoneCannotHaveContactsError) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof UsersNotFoundToCreateGroupError) {
      httpException = new NotFoundException(exception.message)
    }

    super.catch(httpException ?? exception, host)
  }
}
