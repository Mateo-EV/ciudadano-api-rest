export class Contact {
  id: string
  created_at: Date

  from_user_id: string
  to_user_id: string

  other_user: {
    id: string
    firstName: string
    lastName: string
    phone: string
  }

  static create(props: Partial<Contact>): Contact {
    const contact = new Contact()
    Object.assign(contact, props)
    return contact
  }
}
