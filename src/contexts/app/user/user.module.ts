import { Global, Module } from "@nestjs/common"
import { UserRepository } from "./domain/contracts/user.repository"
import { PrismaUserRepository } from "./infraestructure/repositories/prisma-user.repository"

@Global()
@Module({
  providers: [
    // CONTRACTS
    { provide: UserRepository, useClass: PrismaUserRepository }
  ],
  exports: [UserRepository]
})
export class UserModule {}
