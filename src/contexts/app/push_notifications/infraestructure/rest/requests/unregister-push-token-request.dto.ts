import z from "zod"

export const unregisterPushTokenRequestSchema = z.object({
  token: z.string().min(1, "Token es requerido")
})

export class UnregisterPushTokenRequestDto {
  token: string
}
