import type { User } from "@/contexts/app/user/domain/entities/user"

export class Geolocalization {
  id: string
  latitude: number
  longitude: number
  user: User

  static create(geolocation: Partial<Geolocalization>): Geolocalization {
    const instance = new Geolocalization()
    Object.assign(instance, geolocation)
    return instance
  }
}
