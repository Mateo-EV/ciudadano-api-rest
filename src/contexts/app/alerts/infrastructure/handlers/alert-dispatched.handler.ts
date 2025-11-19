import { AlertDispatchedEvent } from "@/contexts/app/alerts/domain/events/alert-dispatched.event"
import { PushTokenRepository } from "@/contexts/app/push_notifications/domain/contracts/push-token.repository"
import { FirebasePushNotificationService } from "@/contexts/app/push_notifications/infraestructure/services/firebase-push-notifcation.service"
import { EventsHandler, IEventHandler } from "@nestjs/cqrs"

@EventsHandler(AlertDispatchedEvent)
export class AlertDispatchedHandler
  implements IEventHandler<AlertDispatchedEvent>
{
  constructor(
    private readonly pushTokenRepository: PushTokenRepository,
    private readonly pushNotificationService: FirebasePushNotificationService
  ) {}

  async handle(event: AlertDispatchedEvent) {
    const { alert, user } = event

    const pushTokens = await this.pushTokenRepository.findActiveTokens(
      alert.userId
    )

    if (pushTokens.length === 0) return

    const tokens = pushTokens.map(token => token.token)

    await this.pushNotificationService.sendToTokens(tokens, {
      notification: {
        title: "🚨 Alerta de Emergencia",
        body: `${user.firstName} ${user.lastName} ha disparado una alerta en tu zona`
      },
      data: {
        alertId: alert.id,
        latitude: alert.geolocation.latitude.toString(),
        longitude: alert.geolocation.longitude.toString(),
        type: "EMERGENCY_ALERT",
        timestamp: new Date().toISOString()
      }
    })
  }
}
