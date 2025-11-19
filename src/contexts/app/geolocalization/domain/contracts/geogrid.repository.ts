import type {
  GeoCell,
  Geolocalization
} from "@/contexts/app/geolocalization/domain/entities/geo-cell"

export abstract class GeogridRepository {
  // abstract findNearbyUsers(
  //   latitude: number,
  //   longitude: number
  // ): Promise<Geolocalization[]>

  // abstract create(geolocalization: Geolocalization): Promise<Geolocalization>
  // abstract deleteById(id: string): Promise<void>
  abstract findNearbyGeoCells(
    latitude: number,
    longitude: number
  ): Promise<GeoCell[]>

  abstract getCellKey(latitude: number, longitude: number): string
  abstract getNeighboringCellKeys(latitude: number, longitude: number): string[]
  abstract findGeolocalizationById(id: string): Promise<Geolocalization | null>

  abstract updateGeolocalizationById(
    latitude: number,
    longitude: number,
    id: string
  ): Promise<Geolocalization>

  abstract deleteGeolocalizationById(id: string): Promise<void>
  abstract addGeolocalization(
    latitude: number,
    longitude: number
  ): Promise<Geolocalization>
}
