import { ContactNotFoundError } from "@/contexts/app/chats/domain/errors/contact-not-found.error"
import { UnauthorizedContactForUserError } from "@/contexts/app/chats/domain/errors/unauthorized-contact-for-user.error"
import { ArgumentsHost, Catch } from "@nestjs/common"
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets"

@Catch(Error)
export class ChatExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    if (exception instanceof WsException) {
      super.catch(exception, host)
      return
    }

    let wsException: WsException | null = null

    if (exception instanceof ContactNotFoundError) {
      wsException = new WsException(exception.message)
    } else if (exception instanceof UnauthorizedContactForUserError) {
      wsException = new WsException("Contacto no encontrado")
    }

    super.catch(wsException ?? exception, host)
  }
}
