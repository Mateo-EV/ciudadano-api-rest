import type { Geolocalization } from "@/contexts/app/geolocalization/domain/entities/geolocalization"

export abstract class UserGeolocalizationRepository {
  abstract findNearbyUsers(
    latitude: number,
    longitude: number
  ): Promise<Geolocalization[]>

  abstract create(geolocalization: Geolocalization): Promise<Geolocalization>
  abstract deleteById(id: string): Promise<void>
}
