import type { Alert } from "@/contexts/app/alerts/domain/entities/alert"
import type { User } from "@/contexts/app/user/domain/entities/user"

export class AlertDispatchedEvent {
  constructor(
    public readonly alert: Alert,
    public readonly user: User
  ) {}
}
