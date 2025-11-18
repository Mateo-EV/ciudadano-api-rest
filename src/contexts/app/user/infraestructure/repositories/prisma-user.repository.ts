import { PrismaService } from "@/lib/db/prisma.service"
import { Injectable } from "@nestjs/common"
import { UserRepository } from "../../domain/contracts/user.repository"
import { User } from "../../domain/entities/user"
import { UserMapper } from "../mappers/user.mapper"

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUserPrisma = await this.prismaService.user.create({
      data: UserMapper.prisma.toCreatePrisma(user)
    })

    return UserMapper.prisma.toDomain(createdUserPrisma)
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id }
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prismaService.user.findUnique({
      where: { email }
    })

    if (!prismaUser) return null

    return UserMapper.prisma.toDomain(prismaUser)
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prismaService.user.findUnique({
      where: { id }
    })

    if (!prismaUser) return null

    return UserMapper.prisma.toDomain(prismaUser)
  }

  async updateById(
    userId: string,
    user: Partial<Omit<User, "id">>
  ): Promise<User> {
    const updatedUserPrisma = await this.prismaService.user.update({
      where: { id: userId },
      data: UserMapper.prisma.toUpdatePrisma(user)
    })

    return UserMapper.prisma.toDomain(updatedUserPrisma)
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { email_verified: true, verificationCode: { delete: {} } }
    })
  }

  async findByDni(dni: string): Promise<User | null> {
    const prismaUser = await this.prismaService.user.findUnique({
      where: { dni }
    })

    if (!prismaUser) return null

    return UserMapper.prisma.toDomain(prismaUser)
  }

  async findByIds(userIds: string[]): Promise<User[]> {
    const prismaUsers = await this.prismaService.user.findMany({
      where: { id: { in: userIds } }
    })

    return prismaUsers.map(user => UserMapper.prisma.toDomain(user))
  }
}
