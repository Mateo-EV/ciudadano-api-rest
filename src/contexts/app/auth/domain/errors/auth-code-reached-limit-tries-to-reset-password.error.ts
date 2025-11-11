export class AuthCodeReachedLimitTriesToResetPasswordError extends Error {
  constructor(email: string) {
    super(
      `El código de restablecimiento de contraseña para el correo ${email} ha alcanzado el límite de intentos.`
    )
  }
}
