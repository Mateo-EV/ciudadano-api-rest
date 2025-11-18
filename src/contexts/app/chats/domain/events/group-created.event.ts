import type { Group } from "@/contexts/app/chats/domain/entities/group"

export class GroupCreatedEvent {
  constructor(
    public readonly groupCreated: Group,
    public readonly payload?: Record<string, unknown>
  ) {}
}
