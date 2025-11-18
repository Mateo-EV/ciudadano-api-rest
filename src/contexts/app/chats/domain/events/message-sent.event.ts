import type { Message } from "@/contexts/app/chats/domain/entities/message"

export class MessageSentEvent {
  constructor(
    public readonly message: Message,
    public readonly userIdToNotify: string,
    public readonly payload?: Record<string, unknown>
  ) {}
}
