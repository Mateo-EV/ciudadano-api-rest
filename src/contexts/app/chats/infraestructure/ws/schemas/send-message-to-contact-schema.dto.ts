import z from "zod"

export const sendMessageToContactSchemaDto = z.object({
  message: z
    .string()
    .nonempty("El mensaje es obligatorio")
    .max(500, "El mensaje no puede exceder los 500 caracteres")
})

export class SendMessageToContactSchemaDto {
  message: string
}
