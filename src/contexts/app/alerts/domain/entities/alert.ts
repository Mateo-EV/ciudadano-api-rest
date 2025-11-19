export class Alert {
  id: string
  userId: string
  geolocation: {
    latitude: number
    longitude: number
  }
  active: boolean
  triggeredAt: Date

  static create(props: Partial<Alert>): Alert {
    const alert = new Alert()
    Object.assign(alert, props)
    return alert
  }
}
