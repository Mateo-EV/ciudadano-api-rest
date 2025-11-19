import { PushTokenPlatform } from "@/contexts/app/push_notifications/domain/entities/push-token"
import z from "zod"

export const registerPushTokenRequestSchema = z.object({
  token: z.string().min(1, "Token es requerido"),
  platform: z.enum(PushTokenPlatform)
})

export class RegisterPushTokenRequestDto {
  token: string
  platform: PushTokenPlatform
}
