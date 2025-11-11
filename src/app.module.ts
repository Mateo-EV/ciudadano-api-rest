import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./contexts/app/auth/auth.module"
import { PrismaModule } from "./lib/db/prisma.module"
import { NodeMailerModule } from "./lib/nodemailer/nodemailer.module"
import { CloudinaryModule } from "@/lib/cloudinary/cloudinary.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    NodeMailerModule,
    CloudinaryModule
  ]
})
export class AppModule {}
