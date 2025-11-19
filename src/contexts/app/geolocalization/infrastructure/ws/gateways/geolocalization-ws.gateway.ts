import {
  AuthenticatedSocket,
  ValidateUserIsAuthenticatedInWsHelper
} from "@/contexts/app/auth/infrastructure/ws/helper/validate-user-is-authenticated-in-ws.helper"
import { AddGeolocalizationUseCase } from "@/contexts/app/geolocalization/application/usecases/add-geolocalization.use-case"
import { DeleteGeolocalizationByIdUseCase } from "@/contexts/app/geolocalization/application/usecases/delete-geolocalization-by-id.use-case"
import { Geolocalization } from "@/contexts/app/geolocalization/domain/entities/geo-cell"

import { wsGeolocalizationSchema } from "@/contexts/app/geolocalization/infrastructure/ws/schema/ws-geolocalization-schema"
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"

type GeolocalizatiionSocket = AuthenticatedSocket & {
  geolocalization: Geolocalization
}

@WebSocketGateway()
export class GeolocalizationWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private addGeolocalizationUseCase: AddGeolocalizationUseCase,
    private deleteGeolocalizationByIdUseCase: DeleteGeolocalizationByIdUseCase,
    private validateUserIsAuthenticatedInWsHelper: ValidateUserIsAuthenticatedInWsHelper
  ) {}

  @WebSocketServer() server: Server

  private async validateUserIsAuthenticatedAndLocated(
    client: Socket
  ): Promise<boolean> {
    const isAuth =
      await this.validateUserIsAuthenticatedInWsHelper.validate(client)

    if (!isAuth) return false

    const authSocket = client as AuthenticatedSocket

    const lat =
      (client.handshake.auth.lat as string) ??
      (client.handshake.query["lat"] as string)
    const lng =
      (client.handshake.auth.lng as string) ??
      (client.handshake.query["lng"] as string)

    if (!lat || !lng) return false

    const { success, data } = wsGeolocalizationSchema.safeParse({
      latitude: lat,
      longitude: lng
    })

    if (!success) return false

    const geoLocalization = await this.addGeolocalizationUseCase.execute({
      latitude: data.latitude,
      longitude: data.longitude
    })
    Object.assign(authSocket, {
      geolocalization: geoLocalization
    }) as GeolocalizatiionSocket

    return true
  }

  async handleConnection(client: Socket) {
    const isValid = await this.validateUserIsAuthenticatedAndLocated(client)

    if (!isValid) {
      client.disconnect()
    }

    const authenticatedSocket = client as GeolocalizatiionSocket

    await authenticatedSocket.join(
      `grid-area:${authenticatedSocket.geolocalization.geocellKey}`
    )
  }

  async handleDisconnect(client: Socket) {
    const clientAsAuthSocket = client as GeolocalizatiionSocket

    await this.deleteGeolocalizationByIdUseCase.execute(
      clientAsAuthSocket.geolocalization.id
    )
  }
}
