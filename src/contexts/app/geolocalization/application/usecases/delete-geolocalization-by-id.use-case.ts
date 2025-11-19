import type { GeogridRepository } from "@/contexts/app/geolocalization/domain/contracts/geogrid.repository"
import type { UseCase } from "@/utils/use-case"

export class DeleteGeolocalizationByIdUseCase implements UseCase<string, void> {
  constructor(private readonly geoGridRepository: GeogridRepository) {}

  async execute(geolocalizationId: string): Promise<void> {
    await this.geoGridRepository.deleteGeolocalizationById(geolocalizationId)
  }
}
