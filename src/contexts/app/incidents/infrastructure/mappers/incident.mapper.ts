import type {
  Incident,
  IncidentType
} from "@/contexts/app/incidents/domain/entities/incidents"
import type { Incident as PrismaIncident } from "@prisma/client"

export type PrismaIncidentWithGeo = PrismaIncident & {
  latitude: number
  longitude: number
}

export class IncidentMapper {
  static prisma = {
    toDomain(prismaIncident: PrismaIncidentWithGeo): Incident {
      return {
        id: prismaIncident.id,
        userId: prismaIncident.user_id,
        incidentType: prismaIncident.incident_type as IncidentType,
        description: prismaIncident.description,
        multimediaUrl: prismaIncident.multimedia_url,
        multimediaKey: prismaIncident.multimedia_key,
        geolocation: {
          latitude: prismaIncident.latitude,
          longitude: prismaIncident.longitude
        },
        createdAt: prismaIncident.created_at
      }
    }
  }
}
