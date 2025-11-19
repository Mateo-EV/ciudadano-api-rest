import { PushTokenRepository } from "@/contexts/app/push_notifications/domain/contracts/push-token.repository"
import { FirebaseService } from "@/lib/firebase/firebase.service"
import { Injectable } from "@nestjs/common"
import { MulticastMessage } from "firebase-admin/messaging"

@Injectable()
export class FirebasePushNotificationService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly pushTokenRepository: PushTokenRepository
  ) {}

  async sendToTokens(
    tokens: string[],
    message: Omit<MulticastMessage, "tokens">
  ) {
    const messaging = this.firebaseService.getMessaging()

    if (!messaging) return

    const response = await messaging.sendEachForMulticast({
      ...message,
      tokens
    })

    if (response.failureCount > 0) {
      const failedTokens: string[] = []
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx])
        }
      })

      if (failedTokens.length > 0) {
        await this.pushTokenRepository.desactiveByTokens(failedTokens)
      }
    }
  }
}
