export class AuthCodeExpiredToVerifyEmailError extends Error {
  constructor(email: string) {
    super(`El código de verificación para el correo ${email} ha expirado.`)
  }
}
