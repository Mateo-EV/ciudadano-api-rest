import z from "zod"

export const updateProfileRequestSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  password: z.string().min(8).max(12).optional()
})

export class UpdateProfileRequestDto {
  firstName?: string
  lastName?: string
  password?: string
}
