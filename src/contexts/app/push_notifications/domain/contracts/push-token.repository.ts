import type { PushToken } from "@/contexts/app/push_notifications/domain/entities/push-token"

export abstract class PushTokenRepository {
  abstract activate(pushToken: PushToken): Promise<PushToken>
  abstract desactiveByToken(token: string): Promise<void>
  abstract desactiveByTokens(tokens: string[]): Promise<void>
  abstract findActiveTokens(excludeUserId?: string): Promise<PushToken[]>
}
