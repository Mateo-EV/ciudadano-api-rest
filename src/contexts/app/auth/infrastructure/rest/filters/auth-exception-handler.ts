import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  HttpStatus,
  UnauthorizedException
} from "@nestjs/common"
import { BaseExceptionFilter } from "@nestjs/core"
import { AuthEmailAlreadyRegisteredError } from "../../../domain/errors/auth-email-already-registered.error"
import { AuthEmailVerificationThrottleExceededError } from "../../../domain/errors/auth-email-verification-throttle-exceeded-error"
import { AuthInvalidCredentialsError } from "../../../domain/errors/auth-invalid-credentials.error"
import { AuthEmailAlreadyVerified } from "../../../domain/errors/auth-email-already-verified"
import { AuthInvalidEmailOrCodeToVerify } from "../../../domain/errors/auth-invalid-email-or-code-to-verify"
import { AuthEmailInvalidToVerify } from "../../../domain/errors/auth-email-invalid-to-verify"
import { AuthDniAlreadyRegisteredError } from "../../../domain/errors/auth-dni-already-registered.error"
import { AuthEmailNotVerifiedError } from "../../../domain/errors/auth-email-not-verified.error"
import { AuthInvalidEmailOrCodeToResetPassword } from "@/contexts/app/auth/domain/errors/auth-invalid-email-or-code-to-reset-password.error"
import { AuthEmailPasswordResetThrottleExceededError } from "@/contexts/app/auth/domain/errors/auth-email-password-reset-throttle-exceeded.error"
import { AuthEmailInvalidToResetPassword } from "@/contexts/app/auth/domain/errors/auth-email-invalid-to-reset-password"
import { AuthCodeExpiredToResetPasswordError } from "@/contexts/app/auth/domain/errors/auth-code-expired-to-reset-password.error"
import { AuthCodeExpiredToVerifyEmailError } from "@/contexts/app/auth/domain/errors/auth-code-expired-to-verify-email.error"
import { AuthCodeInvalidToResetPasswordError } from "@/contexts/app/auth/domain/errors/auth-code-invalid-to-reset-password.error"
import { AuthCodeInvalidToVerifyEmailError } from "@/contexts/app/auth/domain/errors/auth-code-invalid-to-verify-email.error"
import { AuthCodeReachedLimitTriesToResetPasswordError } from "@/contexts/app/auth/domain/errors/auth-code-reached-limit-tries-to-reset-password.error"
import { AuthCodeReachedLimitTriesToVerifyEmailError } from "@/contexts/app/auth/domain/errors/auth-code-reached-limit-tries-to-verify-email.error"

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
    } else if (exception instanceof AuthDniAlreadyRegisteredError) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof AuthEmailNotVerifiedError) {
      httpException = new UnauthorizedException(exception.message)
    } else if (exception instanceof AuthInvalidEmailOrCodeToResetPassword) {
      httpException = new BadRequestException(exception.message)
    } else if (
      exception instanceof AuthEmailPasswordResetThrottleExceededError
    ) {
      httpException = new HttpException(
        exception.message,
        HttpStatus.TOO_MANY_REQUESTS
      )
    } else if (exception instanceof AuthEmailInvalidToResetPassword) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof AuthCodeExpiredToResetPasswordError) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof AuthCodeExpiredToVerifyEmailError) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof AuthCodeInvalidToResetPasswordError) {
      httpException = new BadRequestException(exception.message)
    } else if (exception instanceof AuthCodeInvalidToVerifyEmailError) {
      httpException = new BadRequestException(exception.message)
    } else if (
      exception instanceof AuthCodeReachedLimitTriesToResetPasswordError
    ) {
      httpException = new BadRequestException(exception.message)
    } else if (
      exception instanceof AuthCodeReachedLimitTriesToVerifyEmailError
    ) {
      httpException = new BadRequestException(exception.message)
    }

    super.catch(httpException ?? exception, host)
  }
}
