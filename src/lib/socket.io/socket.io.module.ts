import { SocketIoTransformerIdService } from "@/lib/socket.io/socket-io-transformer-id.service"
import { Global, Module } from "@nestjs/common"

@Global()
@Module({
  providers: [SocketIoTransformerIdService],
  exports: [SocketIoTransformerIdService]
})
export class SocketIOModule {}
