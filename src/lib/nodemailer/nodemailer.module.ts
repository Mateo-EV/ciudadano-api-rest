import { Global, Module } from "@nestjs/common"
import { NodeMailerService } from "./nodemailer.service"

@Global() // 👈 esto lo hace accesible en toda la app
@Module({
  providers: [NodeMailerService],
  exports: [NodeMailerService]
})
export class NodeMailerModule {}
