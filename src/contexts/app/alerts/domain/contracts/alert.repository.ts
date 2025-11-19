import type { Alert } from "@/contexts/app/alerts/domain/entities/alert"

export abstract class AlertRepository {
  abstract create(alert: Alert): Promise<Alert>
}
