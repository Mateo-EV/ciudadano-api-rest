import { AlertRepository } from "@/contexts/app/alerts/domain/contracts/alert.repository"
import { Alert } from "@/contexts/app/alerts/domain/entities/alert"
import { AlertDispatchedEvent } from "@/contexts/app/alerts/domain/events/alert-dispatched.event"
import type { User } from "@/contexts/app/user/domain/entities/user"
import type { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { EventBus } from "@nestjs/cqrs"

type DispatchAlertInput = {
  user: User
  latitude: number
  longitude: number
}

@Injectable()
export class DispatchAlertUseCase
  implements UseCase<DispatchAlertInput, Alert>
{
  constructor(
    private readonly alertRepository: AlertRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: DispatchAlertInput): Promise<Alert> {
    const alertCreated = await this.alertRepository.create(
      Alert.create({
        userId: input.user.id,
        geolocation: {
          latitude: input.latitude,
          longitude: input.longitude
        },
        active: true
      })
    )

    this.eventBus.publish(new AlertDispatchedEvent(alertCreated, input.user))

    return alertCreated
  }
}
