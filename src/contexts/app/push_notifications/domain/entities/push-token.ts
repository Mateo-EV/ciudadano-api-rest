export enum PushTokenPlatform {
  IOS = "ios",
  ANDROID = "android",
  WEB = "web"
}

export class PushToken {
  id: string
  userId: string
  token: string
  platform: PushTokenPlatform
  createdAt: Date
  updatedAt: Date
  isActive: boolean

  static create(props: Partial<PushToken>): PushToken {
    const pushToken = new PushToken()
    Object.assign(pushToken, props)
    return pushToken
  }
}
