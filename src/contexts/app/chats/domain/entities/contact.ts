export class Contact {
  id: string
  created_at: Date

  from_user_id: string
  to_user_id: string

  static create(props: Partial<Contact>): Contact {
    const contact = new Contact()
    Object.assign(contact, props)
    return contact
  }
}
