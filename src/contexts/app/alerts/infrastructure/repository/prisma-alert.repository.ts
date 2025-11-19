import { AlertRepository } from "@/contexts/app/alerts/domain/contracts/alert.repository"
import { Alert } from "@/contexts/app/alerts/domain/entities/alert"
import {
  AlertMapper,
  PrismaAlertWithGeo
} from "@/contexts/app/alerts/infrastructure/mapper/alert.mapper"
import { PrismaService } from "@/lib/db/prisma.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaAlertRepository implements AlertRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(alert: Alert): Promise<Alert> {
    const id = this.prismaService.generateCuid()

    await this.prismaService.$executeRaw`
      INSERT INTO Alert (id, user_id, geolocation, active)
      VALUES (
        ${id}, ${alert.userId},
        ST_PointFromText(${`POINT(${alert.geolocation.latitude} ${alert.geolocation.longitude})`}, 4326),
        ${alert.active}
      )
    `

    return (await this.findById(id))!
  }

  async findById(id: string): Promise<Alert | null> {
    const prismaAlert = await this.prismaService.$queryRaw<
      PrismaAlertWithGeo[]
    >`
      SELECT
        id,
        user_id,
        ST_X(geolocation) AS latitude,
        ST_Y(geolocation) AS longitude,
        active,
        triggered_at
      FROM Alert
      WHERE id = ${id};
    `
    if (!prismaAlert[0]) return null

    return AlertMapper.prisma.toDomain(prismaAlert[0])
  }
}
