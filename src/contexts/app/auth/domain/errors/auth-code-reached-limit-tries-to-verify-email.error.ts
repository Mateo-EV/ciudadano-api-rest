export class AuthCodeReachedLimitTriesToVerifyEmailError extends Error {
  constructor(email: string) {
    super(
      `El código de verificación para el correo ${email} ha alcanzado el límite de intentos.`
    )
  }
}
