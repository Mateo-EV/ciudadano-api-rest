import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import admin from "firebase-admin"

@Injectable()
export class FirebaseService {
  private app: admin.app.App | null

  constructor(private readonly configService: ConfigService) {
    const privateKey = this.configService.get<string>("FIREBASE_PRIVATE_KEY")
    const clientEmail = this.configService.get<string>("FIREBASE_CLIENT_EMAIL")
    const projectId = this.configService.get<string>("FIREBASE_PROJECT_ID")

    if (!admin.apps.length) {
      if (!privateKey || !clientEmail || !projectId) {
        throw new Error("Firebase configuration variables are not set")
      } else {
        try {
          this.app = admin.initializeApp({
            credential: admin.credential.cert({
              privateKey,
              clientEmail,
              projectId
            }),
            projectId
          })
        } catch {
          this.app = null
        }
      }
    } else {
      this.app = admin.apps[0]
    }
  }

  public getMessaging(): admin.messaging.Messaging | null {
    if (!this.app) return null
    return this.app.messaging()
  }
}
