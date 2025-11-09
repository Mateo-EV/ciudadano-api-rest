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
import { AuthEmailAlreadyVerified } from "../../../domain/errors/auth-email-already-verified"
import { AuthInvalidEmailOrCodeToVerify } from "../../../domain/errors/auth-invalid-email-or-code-to-verify"
import { AuthEmailInvalidToVerify } from "../../../domain/errors/auth-email-invalid-to-verify"

@Catch(Error)
export class AuthExceptionHandler extends BaseExceptionFilter {
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
    } else if (exception instanceof AuthEmailAlreadyVerified) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof AuthInvalidEmailOrCodeToVerify) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof AuthEmailInvalidToVerify) {
      httpException = new BadRequestException(exception.message)
    }

    super.catch(httpException ?? exception, host)
  }
}
