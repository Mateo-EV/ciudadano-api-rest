import z from "zod"

export const wsGeolocalizationSchema = z.object({
  latitude: z.coerce
    .number()
    .min(-90, "La latitud debe ser al menos -90")
    .max(90, "La latitud debe ser como máximo 90"),
  longitude: z.coerce
    .number()
    .min(-180, "La longitud debe ser al menos -180")
    .max(180, "La longitud debe ser como máximo 180")
})
