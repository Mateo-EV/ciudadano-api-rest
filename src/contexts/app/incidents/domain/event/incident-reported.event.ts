import type { Incident } from "@/contexts/app/incidents/domain/entities/incidents"

export class IncidentReportedEvent {
  constructor(public readonly incident: Incident) {}
}
