import type { Incident } from "@/contexts/app/incidents/domain/entities/incidents"

export abstract class IncidentNotifier {
  abstract notifyIncidentToNearbyUsers(incident: Incident): Promise<void>
}
