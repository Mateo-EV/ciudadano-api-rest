import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common"
import { catchError, map, Observable, of } from "rxjs"

interface ResponseData {
  data?: unknown
  message?: string
}

@Injectable()
export class ChatWsInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: unknown) => ({
        ok: true,
        data: (data as ResponseData)?.data ?? data,
        message: (data as ResponseData)?.message ?? null
      })),
      catchError(err => {
        return of({
          ok: false,
          message: (err as Error).message || "Ocurrió un error inesperado"
        })
      })
    )
  }
}
