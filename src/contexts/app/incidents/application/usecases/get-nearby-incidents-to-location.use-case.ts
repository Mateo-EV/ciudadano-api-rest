import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { IncidentRepository } from "../../domain/contracts/incident.repository"
import { Incident } from "../../domain/entities/incidents"

interface GetNearbyIncidentsToLocationInput {
  latitude: number
  longitude: number
}

@Injectable()
export class GetNearbyIncidentsToLocationUseCase
  implements UseCase<GetNearbyIncidentsToLocationInput, Incident[]>
{
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async execute(input: GetNearbyIncidentsToLocationInput): Promise<Incident[]> {
    const { latitude, longitude } = input
    const nearbyIncidents = await this.incidentRepository.findNearbyToLocation({
      latitude,
      longitude
    })
    return nearbyIncidents
  }
}
