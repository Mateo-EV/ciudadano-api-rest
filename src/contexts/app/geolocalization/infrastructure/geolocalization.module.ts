import { AddGeolocalizationUseCase } from "@/contexts/app/geolocalization/application/usecases/add-geolocalization.use-case"
import { DeleteGeolocalizationByIdUseCase } from "@/contexts/app/geolocalization/application/usecases/delete-geolocalization-by-id.use-case"
import { GeogridRepository } from "@/contexts/app/geolocalization/domain/contracts/geogrid.repository"
import { InMemoryGeogridRepository } from "@/contexts/app/geolocalization/infrastructure/repositories/in-memory-user-geolocalization.repository"
import { GeolocalizationWsGateway } from "@/contexts/app/geolocalization/infrastructure/ws/gateways/geolocalization-ws.gateway"
import { Global, Module } from "@nestjs/common"

@Global()
@Module({
  providers: [
    // USE CASES
    AddGeolocalizationUseCase,
    DeleteGeolocalizationByIdUseCase,
    // GATEWAYS
    GeolocalizationWsGateway,
    // CONTRACTS
    {
      provide: GeogridRepository,
      useClass: InMemoryGeogridRepository
    }
  ],
  exports: [GeogridRepository, GeolocalizationWsGateway]
})
export class GeolocalizationModule {}
