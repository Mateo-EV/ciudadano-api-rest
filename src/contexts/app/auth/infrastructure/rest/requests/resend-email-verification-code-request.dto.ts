import z from "zod"

export const resendEmailVerificationCodeRequestSchema = z.object({
  email: z.email({
    error: "El email proporcionado no es válido para verificar."
  })
})

export class ResendEmailVerificationCodeRequestDto {
  email: string
}
