import type { ArgumentMetadata, PipeTransform } from "@nestjs/common"
import { Injectable } from "@nestjs/common"
import { WsException } from "@nestjs/websockets"
import { type ZodSchema, ZodError } from "zod"

@Injectable()
export class ZodWsValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.issues)

        throw new WsException(error.issues[0].message)
      }

      throw new WsException("La validación de los datos ha fallado")
    }
  }
}
