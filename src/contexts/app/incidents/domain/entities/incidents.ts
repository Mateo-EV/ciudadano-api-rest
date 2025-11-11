export enum IncidentType {
  STEAL = "robo",
  ACCIDENT = "accidente",
  VANDALISM = "vandalismo"
}

export class Incident {
  id: string
  userId: string
  incidentType: IncidentType
  description: string
  geolocation: {
    latitude: number
    longitude: number
  }
  multimediaUrl: string
  multimediaKey: string

  createdAt: Date

  static create(props: Partial<Incident>): Incident {
    const incident = new Incident()
    Object.assign(incident, props)
    return incident
  }
}
