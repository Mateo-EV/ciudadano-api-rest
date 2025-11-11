import z from "zod"

export const sendPasswordResetCodeEmailRequestSchema = z.object({
  email: z.email("El correo electrónico no es válido")
})

export class SendPasswordResetCodeEmailRequestDto {
  email: string
}
