import { MainWsGateway } from "@/contexts/app/auth/infrastructure/ws/gateways/main-ws.gateway"
import { UserGeolocalizationRepository } from "@/contexts/app/geolocalization/domain/contracts/user-geolocalization.repository"
import { IncidentNotifier } from "@/contexts/app/incidents/domain/contracts/incident.notifier"
import { Incident } from "@/contexts/app/incidents/domain/entities/incidents"
import { SocketIoTransformerIdService } from "@/lib/socket.io/socket-io-transformer-id.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class SocketIncidentNotifier implements IncidentNotifier {
  constructor(
    private readonly userGeolocalizationRepository: UserGeolocalizationRepository,
    private readonly socketIoTransformerIdService: SocketIoTransformerIdService,
    private readonly mainWsGateway: MainWsGateway
  ) {}

  async notifyIncidentToNearbyUsers(incident: Incident): Promise<void> {
    const nearbyUsersGeolocalization =
      await this.userGeolocalizationRepository.findNearbyUsers(
        incident.geolocation.latitude,
        incident.geolocation.longitude
      )
    console.log(nearbyUsersGeolocalization)

    for (const { user } of nearbyUsersGeolocalization) {
      const socketId = this.socketIoTransformerIdService.getSocketIdForUser(
        user.id
      )
      if (socketId) {
        this.mainWsGateway.server
          .to(socketId)
          .emit("incident:reported", { incident })
      }
    }
  }
}
