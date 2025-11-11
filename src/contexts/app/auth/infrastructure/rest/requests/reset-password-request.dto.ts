import z from "zod"

export const sendResetPasswordCodeEmailRequestSchema = z.object({
  email: z.email("El correo electrónico no es válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  code: z.string().nonempty("El código es requerido")
})

export class SendResetPasswordCodeEmailRequestDto {
  email: string
  password: string
  code: string
}
