import { IncidentNotFoundError } from "@/contexts/app/incidents/domain/errors/incident-not-found.error"
import { IncidentNotOwnedError } from "@/contexts/app/incidents/domain/errors/incident-not-owned.error"
import {
  ArgumentsHost,
  Catch,
  HttpException,
  NotFoundException
} from "@nestjs/common"
import { BaseExceptionFilter } from "@nestjs/core"

@Catch(Error)
export class IncidentExceptionFilter extends BaseExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      super.catch(exception, host)
      return
    }

    let httpException: HttpException | null = null

    if (exception instanceof IncidentNotFoundError) {
      httpException = new NotFoundException(exception.message)
    } else if (exception instanceof IncidentNotOwnedError) {
      httpException = new NotFoundException(exception.message)
    }

    super.catch(httpException ?? exception, host)
  }
}
