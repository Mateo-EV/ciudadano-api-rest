export class VerificationCode {
  id: string
  userId: string
  code: string
  sentAt: Date
  expiresAt: Date
  tries: number

  static create(props: Partial<VerificationCode>): VerificationCode {
    const verificationCode = new VerificationCode()
    Object.assign(verificationCode, props)
    return verificationCode
  }
}
