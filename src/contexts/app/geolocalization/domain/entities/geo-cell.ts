export class GeoCell {
  constructor(public readonly key: string) {}
}

export class Geolocalization {
  id: string
  latitude: number
  longitude: number
  geocellKey: string

  static create(props: Partial<Geolocalization>): Geolocalization {
    const geolocalization = new Geolocalization()
    Object.assign(geolocalization, props)
    return geolocalization
  }
}
