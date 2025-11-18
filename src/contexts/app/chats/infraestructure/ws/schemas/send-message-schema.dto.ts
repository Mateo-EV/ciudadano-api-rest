import z from "zod"

export const sendMessageSchema = z.object({
  message: z
    .string()
    .nonempty("El mensaje es obligatorio")
    .max(500, "El mensaje no puede exceder los 500 caracteres")
})

export class SendMessageSchemaDto {
  message: string
}
