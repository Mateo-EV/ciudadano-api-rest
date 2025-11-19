import { GeogridRepository } from "@/contexts/app/geolocalization/domain/contracts/geogrid.repository"
import { Geolocalization } from "@/contexts/app/geolocalization/domain/entities/geo-cell"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

interface AddGeolocalizationInput {
  latitude: number
  longitude: number
}

@Injectable()
export class AddGeolocalizationUseCase
  implements UseCase<AddGeolocalizationInput, Geolocalization>
{
  constructor(private readonly geoGridRepository: GeogridRepository) {}

  async execute(input: AddGeolocalizationInput): Promise<Geolocalization> {
    return await this.geoGridRepository.addGeolocalization(
      input.latitude,
      input.longitude
    )
  }
}
