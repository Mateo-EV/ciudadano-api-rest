import { GeogridRepository } from "@/contexts/app/geolocalization/domain/contracts/geogrid.repository"
import {
  GeoCell,
  Geolocalization
} from "@/contexts/app/geolocalization/domain/entities/geo-cell"
import { Injectable } from "@nestjs/common"

type GeolocalizationMemory = {
  id: string
  latitude: number
  longitude: number
}

@Injectable()
export class InMemoryGeogridRepository extends GeogridRepository {
  private readonly geogrid: Map<string, Set<GeolocalizationMemory>> = new Map()
  private readonly CELL_SIZE = 0.01 // ~1.11 km

  getCellKey(latitude: number, longitude: number): string {
    const latIndex = Math.floor(latitude / this.CELL_SIZE)
    const lonIndex = Math.floor(longitude / this.CELL_SIZE)
    return `${latIndex}:${lonIndex}`
  }

  getNeighboringCellKeys(latitude: number, longitude: number): string[] {
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

  findNearbyGeoCells(latitude: number, longitude: number): Promise<GeoCell[]> {
    const neighboringCellKeys = this.getNeighboringCellKeys(latitude, longitude)
    const nearbyGeoCells: GeoCell[] = []

    for (const cellKey of neighboringCellKeys) {
      const cellGeolocalizations = this.geogrid.get(cellKey)
      if (cellGeolocalizations) {
        nearbyGeoCells.push(new GeoCell(cellKey))
      }
    }
    return Promise.resolve(nearbyGeoCells)
  }

  findGeolocalizationById(id: string): Promise<Geolocalization | null> {
    for (const geolocalizations of this.geogrid.values()) {
      for (const geo of geolocalizations) {
        if (geo.id === id) {
          return Promise.resolve(
            Geolocalization.create({
              id: geo.id,
              latitude: geo.latitude,
              longitude: geo.longitude,
              geocellKey: this.getCellKey(geo.latitude, geo.longitude)
            })
          )
        }
      }
    }
    return Promise.resolve(null)
  }

  deleteGeolocalizationById(id: string): Promise<void> {
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

  async updateGeolocalizationById(
    latitude: number,
    longitude: number,
    id: string
  ): Promise<Geolocalization> {
    const cellKey = this.getCellKey(latitude, longitude)

    await this.deleteGeolocalizationById(id)

    if (!this.geogrid.has(cellKey)) {
      this.geogrid.set(cellKey, new Set())
    }
    const data = {
      id,
      latitude,
      longitude
    }
    this.geogrid.get(cellKey)?.add(data)
    return Promise.resolve(
      Geolocalization.create({
        id: data.id,
        latitude: data.latitude,
        longitude: data.longitude,
        geocellKey: cellKey
      })
    )
  }

  addGeolocalization(
    latitude: number,
    longitude: number
  ): Promise<Geolocalization> {
    const cellKey = this.getCellKey(latitude, longitude)

    if (!this.geogrid.has(cellKey)) {
      this.geogrid.set(cellKey, new Set())
    }
    const data = {
      id: crypto.randomUUID(),
      latitude,
      longitude
    }
    this.geogrid.get(cellKey)?.add(data)
    return Promise.resolve(
      Geolocalization.create({
        id: data.id,
        latitude: data.latitude,
        longitude: data.longitude,
        geocellKey: cellKey
      })
    )
  }
  // create(geolocalization: Geolocalization): Promise<Geolocalization> {
  //   const cellKey = this.getCellKey(
  //     geolocalization.latitude,
  //     geolocalization.longitude
  //   )
  //   if (!this.geogrid.has(cellKey)) {
  //     this.geogrid.set(cellKey, new Set())
  //   }
  //   this.geogrid.get(cellKey)?.add(geolocalization)
  //   return Promise.resolve(geolocalization)
  // }

  // findNearbyUsers(
  //   latitude: number,
  //   longitude: number
  // ): Promise<Geolocalization[]> {
  //   const neighboringCellKeys = this.getNeighboringCellKeys(latitude, longitude)
  //   const nearbyUsers: Geolocalization[] = []
  //   for (const cellKey of neighboringCellKeys) {
  //     const cellGeolocalizations = this.geogrid.get(cellKey)
  //     if (cellGeolocalizations) {
  //       nearbyUsers.push(...cellGeolocalizations)
  //     }
  //   }
  //   return Promise.resolve(nearbyUsers)
  // }

  // deleteById(id: string): Promise<void> {
  //   for (const [cellKey, geolocalizations] of this.geogrid.entries()) {
  //     for (const geo of geolocalizations) {
  //       if (geo.id === id) {
  //         geolocalizations.delete(geo)
  //         if (geolocalizations.size === 0) {
  //           this.geogrid.delete(cellKey)
  //         }
  //         return Promise.resolve()
  //       }
  //     }
  //   }

  //   return Promise.resolve()
  // }
}
