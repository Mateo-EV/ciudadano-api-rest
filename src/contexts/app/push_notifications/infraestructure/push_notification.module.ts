import { RegisterPushTokenUseCase } from "@/contexts/app/push_notifications/application/usecases/register-push-token.use-case"
import { UnregisterPushTokenUseCase } from "@/contexts/app/push_notifications/application/usecases/unregister-push-token.use-case"
import { PushTokenRepository } from "@/contexts/app/push_notifications/domain/contracts/push-token.repository"
import { PrismaPushTokenRepository } from "@/contexts/app/push_notifications/infraestructure/repository/prisma-push-token.repository"
import { PushTokenController } from "@/contexts/app/push_notifications/infraestructure/rest/controllers/push-token.controller"
import { FirebasePushNotificationService } from "@/contexts/app/push_notifications/infraestructure/services/firebase-push-notifcation.service"
import { Global, Module } from "@nestjs/common"

@Global()
@Module({
  providers: [
    // USE CASES
    RegisterPushTokenUseCase,
    UnregisterPushTokenUseCase,
    // CONTRACTS
    { provide: PushTokenRepository, useClass: PrismaPushTokenRepository },
    // SERVICES
    FirebasePushNotificationService
  ],
  controllers: [PushTokenController],
  exports: [PushTokenRepository, FirebasePushNotificationService]
})
export class PushNotificationModule {}
