import type { Incident } from "../entities/incidents"

export abstract class IncidentRepository {
  abstract create(incident: Incident): Promise<Incident>
  abstract findById(id: string): Promise<Incident | null>
  abstract findByUserId(userId: string): Promise<Incident[]>
  abstract updateById(
    userId: string,
    incident: Partial<Omit<Incident, "id">>
  ): Promise<Incident>
  abstract findNearbyToLocation(location: {
    latitude: number
    longitude: number
  }): Promise<Incident[]>
  abstract deleteById(id: string): Promise<void>
}
