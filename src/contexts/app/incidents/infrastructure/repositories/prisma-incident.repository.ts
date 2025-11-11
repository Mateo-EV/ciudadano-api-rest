import { IncidentRepository } from "@/contexts/app/incidents/domain/contracts/incident.repository"
import { Incident } from "@/contexts/app/incidents/domain/entities/incidents"
import {
  IncidentMapper,
  PrismaIncidentWithGeo
} from "@/contexts/app/incidents/infrastructure/mappers/incident.mapper"
import { PrismaService } from "@/lib/db/prisma.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaIncidentRepository implements IncidentRepository {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(incident: Incident): Promise<Incident> {
    const prismaId = this.prismaService.generateCuid()
    await this.prismaService.$executeRaw`
      INSERT INTO Incident
      (id, user_id, incident_type, description, multimedia_url, multimedia_key, geolocation)
      VALUES (
        ${prismaId},
        ${incident.userId},
        ${incident.incidentType},
        ${incident.description},
        ${incident.multimediaUrl},
        ${incident.multimediaKey},
        ST_PointFromText(${`POINT(${incident.geolocation.latitude} ${incident.geolocation.longitude})`}, 4326)
      );`

    return (await this.findById(prismaId))!
  }

  async findById(id: string): Promise<Incident | null> {
    const prismaIncident = await this.prismaService.$queryRaw<
      PrismaIncidentWithGeo[]
    >`
      SELECT
        id,
        user_id,
        incident_type,
        description,
        multimedia_url,
        multimedia_key,
        ST_X(geolocation) AS latitude,
        ST_Y(geolocation) AS longitude,
        created_at
      FROM Incident
      WHERE id = ${id};
    `

    if (!prismaIncident[0]) return null

    return IncidentMapper.prisma.toDomain(prismaIncident[0])
  }

  async deleteById(id: string): Promise<void> {
    await this.prismaService.incident.delete({ where: { id } })
  }

  async updateById(
    id: string,
    incident: Partial<Omit<Incident, "id">>
  ): Promise<Incident> {
    const setClauses: string[] = []
    const values: string[] = []

    if (incident.userId !== undefined) {
      setClauses.push(`user_id = ?`)
      values.push(incident.userId)
    }
    if (incident.incidentType !== undefined) {
      setClauses.push(`incident_type = ?`)
      values.push(incident.incidentType)
    }
    if (incident.description !== undefined) {
      setClauses.push(`description = ?`)
      values.push(incident.description)
    }
    if (incident.multimediaUrl !== undefined) {
      setClauses.push(`multimedia_url = ?`)
      values.push(incident.multimediaUrl)
    }
    if (incident.multimediaKey !== undefined) {
      setClauses.push(`multimedia_key = ?`)
      values.push(incident.multimediaKey)
    }
    if (incident.geolocation !== undefined) {
      setClauses.push(`geolocation = ST_PointFromText(?)`)
      values.push(
        `POINT(${incident.geolocation.latitude} ${incident.geolocation.longitude})`
      )
    }

    if (setClauses.length === 0) {
      return Incident.create({ id, ...incident })
    }

    await this.prismaService.$executeRawUnsafe(
      `UPDATE Incident SET ${setClauses.join(", ")} WHERE id = ?`,
      ...values,
      id
    )

    return Incident.create({ id, ...incident })
  }

  async findByUserId(userId: string): Promise<Incident[]> {
    const prismaIncidents = await this.prismaService.$queryRaw<
      PrismaIncidentWithGeo[]
    >`
      SELECT
        id,
        user_id,
        incident_type,
        description,
        multimedia_url,
        multimedia_key,
        ST_X(geolocation) AS latitude,
        ST_Y(geolocation) AS longitude,
        created_at
      FROM Incident
      WHERE user_id = ${userId};
    `

    return prismaIncidents.map(prismaIncident =>
      IncidentMapper.prisma.toDomain(prismaIncident)
    )
  }

  // Find incidents within 1 km radius of the given location
  async findNearbyToLocation(location: {
    latitude: number
    longitude: number
  }): Promise<Incident[]> {
    const prismaIncidents = await this.prismaService.$queryRaw<
      PrismaIncidentWithGeo[]
    >`
      SELECT
        id,
        user_id,
        incident_type,
        description,
        multimedia_url,
        multimedia_key,
        ST_X(geolocation) AS latitude,
        ST_Y(geolocation) AS longitude,
        created_at
      FROM Incident
      WHERE ST_Distance(geolocation, ST_PointFromText(${`POINT(${location.latitude} ${location.longitude})`}, 4326)) < 1000;
    `

    return prismaIncidents.map(prismaIncident =>
      IncidentMapper.prisma.toDomain(prismaIncident)
    )
  }
}
