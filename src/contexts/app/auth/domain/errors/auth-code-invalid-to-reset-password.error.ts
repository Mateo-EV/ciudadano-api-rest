export class AuthCodeInvalidToResetPasswordError extends Error {
  constructor(email: string) {
    super(
      `El código de restablecimiento de contraseña para el correo ${email} es inválido.`
    )
  }
}
