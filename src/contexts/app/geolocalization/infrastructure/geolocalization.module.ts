import { AddGeolocalizationDataFromUserUseCase } from "@/contexts/app/geolocalization/application/usecases/add-geolocalization-data-from-user.use-case"
import { DeleteGeolocalizationDataByIdUseCase } from "@/contexts/app/geolocalization/application/usecases/delete-geolocalization-data-by-id.user-case"
import { UserGeolocalizationRepository } from "@/contexts/app/geolocalization/domain/contracts/user-geolocalization.repository"
import { InMemoryUserGeolocalizationRepository } from "@/contexts/app/geolocalization/infrastructure/repositories/in-memory-user-geolocalization.repository"
import { GeolocalizationWsGateway } from "@/contexts/app/geolocalization/infrastructure/ws/gateways/geolocalization-ws.gateway"
import { Global, Module } from "@nestjs/common"

@Global()
@Module({
  providers: [
    // USE CASES
    AddGeolocalizationDataFromUserUseCase,
    DeleteGeolocalizationDataByIdUseCase,
    // GATEWAYS
    GeolocalizationWsGateway,
    // CONTRACTS
    {
      provide: UserGeolocalizationRepository,
      useClass: InMemoryUserGeolocalizationRepository
    }
  ],
  exports: [UserGeolocalizationRepository, GeolocalizationWsGateway]
})
export class GeolocalizationModule {}
