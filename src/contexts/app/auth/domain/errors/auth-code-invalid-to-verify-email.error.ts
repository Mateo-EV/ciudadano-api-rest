export class AuthCodeInvalidToVerifyEmailError extends Error {
  constructor(email: string) {
    super(`El código de verificación para el correo ${email} es inválido.`)
  }
}
