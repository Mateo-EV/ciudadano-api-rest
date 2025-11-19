import { Alert } from "@/contexts/app/alerts/domain/entities/alert"
import type { Alert as PrismaAlert } from "@prisma/client"

export type PrismaAlertWithGeo = PrismaAlert & {
  latitude: number
  longitude: number
}

export class AlertMapper {
  static prisma = {
    toDomain(prismaAlert: PrismaAlertWithGeo): Alert {
      return Alert.create({
        id: prismaAlert.id,
        userId: prismaAlert.user_id,
        geolocation: {
          latitude: prismaAlert.latitude,
          longitude: prismaAlert.longitude
        },
        active: prismaAlert.active,
        triggeredAt: prismaAlert.triggered_at
      })
    }
  }
}
