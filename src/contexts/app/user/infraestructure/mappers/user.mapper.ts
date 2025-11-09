import type { User as PrismaUser } from "@prisma/client"
import { User } from "../../domain/entities/user"

export class UserMapper {
  static prisma = {
    toDomain(prismaUser: Partial<PrismaUser>): User {
      return User.create({
        id: prismaUser.id,
        firstName: prismaUser.first_name,
        lastName: prismaUser.last_name,
        phone: prismaUser.phone,
        email: prismaUser.email,
        isEmailVerified: prismaUser.email_verified,
        password: prismaUser.password,
        dni: prismaUser.dni,
        createdAt: prismaUser.created_at
      })
    },
    toPrisma(user: User): PrismaUser {
      return {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone,
        email: user.email,
        email_verified: user.isEmailVerified,
        password: user.password,
        dni: user.dni,
        created_at: user.createdAt
      }
    }
  }
}
