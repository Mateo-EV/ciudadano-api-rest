export class User {
  id: string

  firstName: string
  lastName: string
  phone: string | null
  email: string
  isEmailVerified: boolean
  password: string
  dni: string

  createdAt: Date

  static create(props: Partial<User>): User {
    const user = new User()
    Object.assign(user, props)
    return user
  }
}
