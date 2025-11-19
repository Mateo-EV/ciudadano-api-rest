import { CloudinaryModule } from "@/lib/cloudinary/cloudinary.module"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { AuthModule } from "./contexts/app/auth/auth.module"
import { PrismaModule } from "./lib/db/prisma.module"
import { NodeMailerModule } from "./lib/nodemailer/nodemailer.module"
import { FirebaseModule } from "@/lib/firebase/firebase.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule.forRoot(),
    AuthModule,
    PrismaModule,
    NodeMailerModule,
    CloudinaryModule,
    FirebaseModule
  ]
})
export class AppModule {}
