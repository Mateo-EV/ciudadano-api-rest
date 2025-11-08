import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./contexts/app/auth/auth.module"
import { UserModule } from "./contexts/app/user/user.module"
import { PrismaModule } from "./lib/db/prisma.module"
import { NodeMailerModule } from "./lib/nodemailer/nodemailer.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    NodeMailerModule
  ]
})
export class AppModule {}
