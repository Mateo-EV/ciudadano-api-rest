import z from "zod"

export const dispatchAlertRequestSchema = z.object({
  latitude: z
    .number()
    .min(-90, "La latitud debe ser mayor o igual a -90")
    .max(90, "La latitud debe ser menor o igual a 90"),
  longitude: z
    .number()
    .min(-180, "La longitud debe ser mayor o igual a -180")
    .max(180, "La longitud debe ser menor o igual a 180")
})

export class DispatchAlertRequestDto {
  latitude: number
  longitude: number
}
