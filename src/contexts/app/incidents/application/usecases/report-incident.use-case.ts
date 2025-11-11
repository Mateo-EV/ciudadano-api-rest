import { Injectable } from "@nestjs/common"
import { Incident, IncidentType } from "../../domain/entities/incidents"
import { UseCase } from "@/utils/use-case"
import { IncidentRepository } from "../../domain/contracts/incident.repository"
import { StorageContract } from "@/core/storage/contracts/storage.contract"

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
    private readonly storageContract: StorageContract
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
    return incident
  }
}
