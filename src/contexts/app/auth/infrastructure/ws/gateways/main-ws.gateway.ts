import { GetAuthProfileUseCase } from "@/contexts/app/auth/application/usecases/get-auth-profile.use-case"
import { TokenContract } from "@/contexts/app/auth/domain/contracts/token.contract"
import { wsGeolocalizationSchema } from "@/contexts/app/auth/infrastructure/ws/schema/ws-geolocalization-schema"
import { Geolocalization } from "@/contexts/app/geolocalization/domain/entities/geolocalization"
import { GeolocalizationWsGateway } from "@/contexts/app/geolocalization/infrastructure/ws/gateways/geolocalization-ws.gateway"
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"

export interface AuthenticatedSocket extends Socket {
  geolocalization: Geolocalization
}

@WebSocketGateway()
export class MainWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly geolocalizationWsGateway: GeolocalizationWsGateway,
    private readonly tokenContract: TokenContract,
    private readonly getAuthProfileUseCase: GetAuthProfileUseCase
  ) {}

  @WebSocketServer() server: Server

  private async validateUserIsAuthenticated(client: Socket): Promise<boolean> {
    const token =
      (client.handshake.auth.token as string) ??
      client.handshake.headers["authorization"]

    if (!token) return false

    const tokenFormatted = token.startsWith("Bearer ")
      ? token.slice(7, token.length)
      : token

    const userId = await this.tokenContract.verify(tokenFormatted)
    if (!userId) return false

    const user = await this.getAuthProfileUseCase.execute(userId)
    if (!user) return false

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

    client["geolocalization"] = Geolocalization.create({
      id: client.id,
      latitude: data.latitude,
      longitude: data.longitude,
      user
    })

    return true
  }

  async handleConnection(client: Socket) {
    const isAuthenticated = await this.validateUserIsAuthenticated(client)

    if (!isAuthenticated) {
      return client.disconnect()
    }

    const clientAsAuthSocket = client as AuthenticatedSocket

    await this.geolocalizationWsGateway.handleConnection(
      clientAsAuthSocket.geolocalization.user,
      clientAsAuthSocket.geolocalization.latitude,
      clientAsAuthSocket.geolocalization.longitude,
      clientAsAuthSocket.id
    )
  }

  async handleDisconnect(client: Socket) {
    const clientAsAuthSocket = client as AuthenticatedSocket
    if (!clientAsAuthSocket.geolocalization) return

    await this.geolocalizationWsGateway.handleDisconnect(
      clientAsAuthSocket.geolocalization.user,
      clientAsAuthSocket.id
    )
  }
}
