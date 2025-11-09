import { z } from "zod"

export const verifyEmailRequestSchema = z.object({
  email: z.email({ error: "Dirección de correo electrónico inválida" }),
  code: z.string().max(10, { error: "El código de verificación es invalido" })
})

export class VerifyEmailRequestDto {
  email: string
  code: string
}
