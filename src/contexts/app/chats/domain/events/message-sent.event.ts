import type { Message } from "@/contexts/app/chats/domain/entities/message"
import type { User } from "@/contexts/app/user/domain/entities/user"

export class MessageSentEvent {
  constructor(
    public readonly message: Message,
    public readonly userIdsToNotify: string[],
    public readonly sender: User,
    public readonly payload?: Record<string, unknown>
  ) {}
}
