import { IncidentReportedEvent } from "@/contexts/app/incidents/domain/event/incident-reported.event"
import { StorageContract } from "@/core/storage/contracts/storage.contract"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { EventBus } from "@nestjs/cqrs"
import { IncidentRepository } from "../../domain/contracts/incident.repository"
import { Incident, IncidentType } from "../../domain/entities/incidents"

interface ReportIncidentInput {
  incidentType: IncidentType
  description: string
  geolocation: {
    latitude: number
    longitude: number
  }
  multimedia: Express.Multer.File
  user_id: string
}

@Injectable()
export class ReportIncidentUseCase
  implements UseCase<ReportIncidentInput, Incident>
{
  constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly storageContract: StorageContract,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: ReportIncidentInput): Promise<Incident> {
    const { url, key } = await this.storageContract.uploadFile(input.multimedia)

    const incident = await this.incidentRepository.create(
      Incident.create({
        geolocation: input.geolocation,
        incidentType: input.incidentType,
        description: input.description,
        multimediaUrl: url,
        multimediaKey: key,
        userId: input.user_id
      })
    )

    this.eventBus.publish(new IncidentReportedEvent(incident))

    return incident
  }
}
