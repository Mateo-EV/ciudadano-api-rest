import { UserGeolocalizationRepository } from "@/contexts/app/geolocalization/domain/contracts/user-geolocalization.repository"
import { Geolocalization } from "@/contexts/app/geolocalization/domain/entities/geolocalization"
import { Injectable } from "@nestjs/common"

@Injectable()
export class InMemoryUserGeolocalizationRepository extends UserGeolocalizationRepository {
  private readonly geogrid: Map<string, Set<Geolocalization>> = new Map()
  private readonly CELL_SIZE = 0.01 // ~1.11 km

  private getCellKey(latitude: number, longitude: number): string {
    const latIndex = Math.floor(latitude / this.CELL_SIZE)
    const lonIndex = Math.floor(longitude / this.CELL_SIZE)
    return `${latIndex}:${lonIndex}`
  }

  private getNeighboringCellKeys(
    latitude: number,
    longitude: number
  ): string[] {
    const latIndex = Math.floor(latitude / this.CELL_SIZE)
    const lonIndex = Math.floor(longitude / this.CELL_SIZE)
    const keys: string[] = []
    for (let dLat = -1; dLat <= 1; dLat++) {
      for (let dLon = -1; dLon <= 1; dLon++) {
        keys.push(`${latIndex + dLat}:${lonIndex + dLon}`)
      }
    }
    return keys
  }

  create(geolocalization: Geolocalization): Promise<Geolocalization> {
    const cellKey = this.getCellKey(
      geolocalization.latitude,
      geolocalization.longitude
    )
    if (!this.geogrid.has(cellKey)) {
      this.geogrid.set(cellKey, new Set())
    }
    this.geogrid.get(cellKey)?.add(geolocalization)
    return Promise.resolve(geolocalization)
  }

  findNearbyUsers(
    latitude: number,
    longitude: number
  ): Promise<Geolocalization[]> {
    const neighboringCellKeys = this.getNeighboringCellKeys(latitude, longitude)
    const nearbyUsers: Geolocalization[] = []
    for (const cellKey of neighboringCellKeys) {
      const cellGeolocalizations = this.geogrid.get(cellKey)
      if (cellGeolocalizations) {
        nearbyUsers.push(...cellGeolocalizations)
      }
    }
    return Promise.resolve(nearbyUsers)
  }

  deleteById(id: string): Promise<void> {
    for (const [cellKey, geolocalizations] of this.geogrid.entries()) {
      for (const geo of geolocalizations) {
        if (geo.id === id) {
          geolocalizations.delete(geo)
          if (geolocalizations.size === 0) {
            this.geogrid.delete(cellKey)
          }
          return Promise.resolve()
        }
      }
    }

    return Promise.resolve()
  }
}
