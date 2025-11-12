import { Injectable } from "@nestjs/common"

@Injectable()
export class SocketIoTransformerIdService {
  private readonly userSocketsIdMap: Map<string, string>

  constructor() {
    this.userSocketsIdMap = new Map<string, string>()
  }

  setSocketIdForUser(userId: string, socketId: string): void {
    this.userSocketsIdMap.set(userId, socketId)
  }

  getSocketIdForUser(userId: string): string | undefined {
    return this.userSocketsIdMap.get(userId)
  }

  removeSocketIdForUser(userId: string): void {
    this.userSocketsIdMap.delete(userId)
  }

  clearAllSocketIds(): void {
    this.userSocketsIdMap.clear()
  }
}
