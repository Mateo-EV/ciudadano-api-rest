import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  HttpStatus
} from "@nestjs/common"
import { BaseExceptionFilter } from "@nestjs/core"
import { AuthEmailAlreadyRegisteredError } from "../../../domain/errors/auth-email-already-registered.error"
import { AuthEmailVerificationThrottleExceededError } from "../../../domain/errors/auth-email-verification-throttle-exceeded-error"
import { AuthInvalidCredentialsError } from "../../../domain/errors/auth-invalid-credentials.error"

@Catch(Error)
export class AuthFilterException extends BaseExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      super.catch(exception, host)
      return
    }

    let httpException: HttpException | null = null

    if (exception instanceof AuthInvalidCredentialsError) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof AuthEmailAlreadyRegisteredError) {
      httpException = new BadRequestException(exception.message)
    } else if (
      exception instanceof AuthEmailVerificationThrottleExceededError
    ) {
      httpException = new HttpException(
        exception.message,
        HttpStatus.TOO_MANY_REQUESTS
      )
    }

    super.catch(httpException ?? exception, host)
  }
}
