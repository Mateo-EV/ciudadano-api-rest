import { UserGeolocalizationRepository } from "@/contexts/app/geolocalization/domain/contracts/user-geolocalization.repository"
import { Geolocalization } from "@/contexts/app/geolocalization/domain/entities/geolocalization"
import { User } from "@/contexts/app/user/domain/entities/user"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

interface AddGeolocalizationDataFromUserInput {
  id: string
  user: User
  latitude: number
  longitude: number
}

@Injectable()
export class AddGeolocalizationDataFromUserUseCase
  implements UseCase<AddGeolocalizationDataFromUserInput, void>
{
  constructor(
    private readonly userGeolocalizartionRepository: UserGeolocalizationRepository
  ) {}

  async execute(input: AddGeolocalizationDataFromUserInput): Promise<void> {
    await this.userGeolocalizartionRepository.create(
      Geolocalization.create({
        id: input.id,
        latitude: input.latitude,
        longitude: input.longitude,
        user: input.user
      })
    )
  }
}
