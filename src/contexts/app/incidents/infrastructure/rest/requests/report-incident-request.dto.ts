import { IncidentType } from "@/contexts/app/incidents/domain/entities/incidents"
import { ApiProperty } from "@nestjs/swagger"
import z from "zod"

export const reportIncidentRequestSchema = z.object({
  incident_type: z.enum(IncidentType),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(191, "La descripción no puede tener más de 191 caracteres"),
  latitude: z.coerce
    .number()
    .min(-90, "La latitud debe estar entre -90 y 90")
    .max(90, "La latitud debe estar entre -90 y 90"),
  longitude: z.coerce
    .number()
    .min(-180, "La longitud debe estar entre -180 y 180")
    .max(180, "La longitud debe estar entre -180 y 180")
})

export class ReportIncidentRequestDto {
  incident_type: IncidentType
  description: string
  latitude: number
  longitude: number

  @ApiProperty({ type: "string", format: "binary" })
  multimedia: Express.Multer.File
}
