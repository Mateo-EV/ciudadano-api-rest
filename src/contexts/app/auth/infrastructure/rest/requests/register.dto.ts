import { z } from "zod"

export const registerRequestSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Dirección de correo electrónico inválida"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  dni: z.string().length(8, "El DNI debe tener exactamente 8 caracteres"),
  phone: z
    .string()
    .regex(/^\d{9}$/, "El número de teléfono debe tener 9 dígitos")
})

export class RegisterRequestDto {
  firstName: string
  lastName: string
  email: string
  password: string
  dni: string
  phone: string
}
