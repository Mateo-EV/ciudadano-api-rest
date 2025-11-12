import type { UserGeolocalizationRepository } from "@/contexts/app/geolocalization/domain/contracts/user-geolocalization.repository"
import type { UseCase } from "@/utils/use-case"

export class DeleteGeolocalizationDataByIdUseCase
  implements UseCase<string, void>
{
  constructor(
    private readonly userGeolocalizationRepository: UserGeolocalizationRepository
  ) {}

  async execute(geolocalizationId: string): Promise<void> {
    await this.userGeolocalizationRepository.deleteById(geolocalizationId)
  }
}
