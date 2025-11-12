import { CloudinaryModule } from "@/lib/cloudinary/cloudinary.module"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./contexts/app/auth/auth.module"
import { PrismaModule } from "./lib/db/prisma.module"
import { NodeMailerModule } from "./lib/nodemailer/nodemailer.module"
import { SocketIOModule } from "@/lib/socket.io/socket.io.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    NodeMailerModule,
    CloudinaryModule,
    SocketIOModule
  ]
})
export class AppModule {}
