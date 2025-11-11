export class PasswordResetCode {
  id: string
  userId: string
  code: string
  createdAt: Date
  expiresAt: Date
  tries: number

  static create(props: Partial<PasswordResetCode>): PasswordResetCode {
    const passwordResetCode = new PasswordResetCode()
    Object.assign(passwordResetCode, props)
    return passwordResetCode
  }
}
