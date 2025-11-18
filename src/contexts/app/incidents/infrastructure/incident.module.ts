import { GetNearbyIncidentsToLocationUseCase } from "@/contexts/app/incidents/application/usecases/get-nearby-incidents-to-location.use-case"
import { ReportIncidentUseCase } from "@/contexts/app/incidents/application/usecases/report-incident.use-case"
import { UnreportIncidentUseCase } from "@/contexts/app/incidents/application/usecases/unreport-incident.use-case"
import { IncidentNotifier } from "@/contexts/app/incidents/domain/contracts/incident.notifier"
import { IncidentRepository } from "@/contexts/app/incidents/domain/contracts/incident.repository"
import { SocketIncidentNotifier } from "@/contexts/app/incidents/infrastructure/notifiers/socket-incident.notifier"
import { PrismaIncidentRepository } from "@/contexts/app/incidents/infrastructure/repositories/prisma-incident.repository"
import { IncidentController } from "@/contexts/app/incidents/infrastructure/rest/controllers/incident.controller"
import { IncidentExceptionFilter } from "@/contexts/app/incidents/infrastructure/rest/filters/incident-exception.filter"
import { Module } from "@nestjs/common"
import { APP_FILTER } from "@nestjs/core"

@Module({
  providers: [
    // USE CASES
    GetNearbyIncidentsToLocationUseCase,
    ReportIncidentUseCase,
    UnreportIncidentUseCase,
    // CONTRACTS
    { provide: IncidentRepository, useClass: PrismaIncidentRepository },
    { provide: IncidentNotifier, useClass: SocketIncidentNotifier },
    { provide: APP_FILTER, useClass: IncidentExceptionFilter }
  ],
  controllers: [IncidentController],
  exports: [IncidentRepository]
})
export class IncidentModule {}
