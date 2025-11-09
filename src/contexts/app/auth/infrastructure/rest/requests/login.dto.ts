import { z } from "zod"

export const loginRequestSchema = z.object({
  email: z.string().min(1, "El email es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria")
})

export class LoginRequestDto {
  email: string
  password: string
}
