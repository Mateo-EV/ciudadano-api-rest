import { DispatchAlertUseCase } from "@/contexts/app/alerts/application/usecases/dispatch-alert.use-case"
import { AlertRepository } from "@/contexts/app/alerts/domain/contracts/alert.repository"
import { AlertDispatchedHandler } from "@/contexts/app/alerts/infrastructure/handlers/alert-dispatched.handler"
import { PrismaAlertRepository } from "@/contexts/app/alerts/infrastructure/repository/prisma-alert.repository"
import { AlertController } from "@/contexts/app/alerts/infrastructure/rest/controllers/alert.controller"
import { Module } from "@nestjs/common"

@Module({
  providers: [
    // USE CASES
    DispatchAlertUseCase,
    // CONTRACTS
    { provide: AlertRepository, useClass: PrismaAlertRepository },
    // HANDLERS
    AlertDispatchedHandler
  ],
  controllers: [AlertController]
})
export class AlertModule {}
