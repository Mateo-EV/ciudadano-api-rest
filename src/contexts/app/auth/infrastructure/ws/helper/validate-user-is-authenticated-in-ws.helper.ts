import { GetAuthProfileUseCase } from "@/contexts/app/auth/application/usecases/get-auth-profile.use-case"
import { TokenContract } from "@/contexts/app/auth/domain/contracts/token.contract"
import type { User } from "@/contexts/app/user/domain/entities/user"
import { Injectable } from "@nestjs/common"
import { WsException } from "@nestjs/websockets"
import type { Socket } from "socket.io"

export interface AuthenticatedSocket extends Socket {
  user: User
  payload: object
}

@Injectable()
export class ValidateUserIsAuthenticatedInWsHelper {
  constructor(
    private readonly getAuthProfileUseCase: GetAuthProfileUseCase,
    private readonly tokenContract: TokenContract
  ) {}

  async validate(client: Socket): Promise<AuthenticatedSocket> {
    const token =
      (client.handshake.auth.token as string) ??
      client.handshake.headers["authorization"]

    if (!token) {
      client.disconnect()
      throw new WsException("No se ha proporcionado un token de autenticación")
    }

    const tokenFormatted = token.startsWith("Bearer ")
      ? token.slice(7, token.length)
      : token

    const userId = await this.tokenContract.verify(tokenFormatted)
    if (!userId) {
      client.disconnect()
      throw new WsException("Token de autenticación inválido")
    }

    const user = await this.getAuthProfileUseCase.execute(userId)
    if (!user) {
      client.disconnect()
      throw new WsException("Usuario no encontrado")
    }

    return Object.assign(client, { user, payload: {} }) as AuthenticatedSocket
  }
}
