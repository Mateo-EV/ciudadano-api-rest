import { PushTokenRepository } from "@/contexts/app/push_notifications/domain/contracts/push-token.repository"
import type { PushTokenPlatform } from "@/contexts/app/push_notifications/domain/entities/push-token"
import { PushToken } from "@/contexts/app/push_notifications/domain/entities/push-token"
import type { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type RegisterPushTokenInput = {
  token: string
  platform: PushTokenPlatform
  userAuthId: string
}

@Injectable()
export class RegisterPushTokenUseCase
  implements UseCase<RegisterPushTokenInput, PushToken>
{
  constructor(private readonly pushTokenRepository: PushTokenRepository) {}

  async execute(input: RegisterPushTokenInput): Promise<PushToken> {
    const pushToken = await this.pushTokenRepository.activate(
      PushToken.create({
        token: input.token,
        platform: input.platform,
        userId: input.userAuthId,
        isActive: true
      })
    )

    return pushToken
  }
}
