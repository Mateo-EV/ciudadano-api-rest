import { AddGeolocalizationDataFromUserUseCase } from "@/contexts/app/geolocalization/application/usecases/add-geolocalization-data-from-user.use-case"
import { DeleteGeolocalizationDataByIdUseCase } from "@/contexts/app/geolocalization/application/usecases/delete-geolocalization-data-by-id.user-case"
import { User } from "@/contexts/app/user/domain/entities/user"
import { SocketIoTransformerIdService } from "@/lib/socket.io/socket-io-transformer-id.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class GeolocalizationWsGateway {
  constructor(
    private addGeolocalizationDataFromUserUseCase: AddGeolocalizationDataFromUserUseCase,
    private deleteGeolocalizationDataByIdUseCase: DeleteGeolocalizationDataByIdUseCase,
    private socketIoTransformerIdService: SocketIoTransformerIdService
  ) {}

  async handleConnection(
    user: User,
    lat: number,
    lng: number,
    socketId: string
  ) {
    this.socketIoTransformerIdService.setSocketIdForUser(user.id, socketId)
    await this.addGeolocalizationDataFromUserUseCase.execute({
      id: socketId,
      user,
      latitude: lat,
      longitude: lng
    })
  }

  async handleDisconnect(user: User, socketId: string) {
    this.socketIoTransformerIdService.removeSocketIdForUser(user.id)
    await this.deleteGeolocalizationDataByIdUseCase.execute(socketId)
  }
}
