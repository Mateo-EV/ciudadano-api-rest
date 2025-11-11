import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { StorageContract } from "@/core/storage/contracts/storage.contract"
import { IncidentNotFoundError } from "@/contexts/app/incidents/domain/errors/incident-not-found.error"
import { IncidentNotOwnedError } from "@/contexts/app/incidents/domain/errors/incident-not-owned.error"
import { IncidentRepository } from "@/contexts/app/incidents/domain/contracts/incident.repository"

interface UnreportIncidentInput {
  incidentId: string
  userId: string
}

@Injectable()
export class UnreportIncidentUseCase
  implements UseCase<UnreportIncidentInput, void>
{
  constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly storageContract: StorageContract
  ) {}

  async execute(input: UnreportIncidentInput): Promise<void> {
    const { incidentId, userId } = input

    const incident = await this.incidentRepository.findById(incidentId)

    if (!incident) {
      throw new IncidentNotFoundError(incidentId)
    }

    if (incident.userId !== userId) {
      throw new IncidentNotOwnedError(incidentId, userId)
    }

    await this.storageContract.deleteFile(incident.multimediaKey)

    await this.incidentRepository.deleteById(incidentId)
  }
}
