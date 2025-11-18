import z from "zod"

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre debe tener máximo 100 caracteres"),
  description: z
    .string()
    .max(191, "La descripción debe tener máximo 191 caracteres")
    .nullish(),
  memberIds: z.array(
    z.string().nonempty("El ID del miembro no puede estar vacío")
  )
})

export class CreateGroupSchemaDto {
  name: string
  description?: string | null
  memberIds: string[]
}
