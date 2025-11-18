import z from "zod"

export const addContactSchema = z.object({
  user_contact_id: z.string().nonempty("El contacto es obligatorio")
})

export class AddContactSchemaDto {
  user_contact_id: string
}
