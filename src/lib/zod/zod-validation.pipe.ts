import type { PipeTransform, ArgumentMetadata } from "@nestjs/common"
import { BadRequestException, Injectable } from "@nestjs/common"
import { type ZodSchema, ZodError } from "zod"

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      console.log(value)
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.issues)

        throw new BadRequestException(error.issues[0].message)
      }

      throw new BadRequestException("La validación de los datos ha fallado")
    }
  }
}
