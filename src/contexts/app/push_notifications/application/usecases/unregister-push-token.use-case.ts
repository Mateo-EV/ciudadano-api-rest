import { PushTokenRepository } from "@/contexts/app/push_notifications/domain/contracts/push-token.repository"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

type UnregisterPushTokenInput = {
  token: string
}

@Injectable()
export class UnregisterPushTokenUseCase
  implements UseCase<UnregisterPushTokenInput, void>
{
  constructor(private readonly pushTokenRepository: PushTokenRepository) {}

  async execute(input: UnregisterPushTokenInput): Promise<void> {
    await this.pushTokenRepository.desactiveByToken(input.token)
  }
}
