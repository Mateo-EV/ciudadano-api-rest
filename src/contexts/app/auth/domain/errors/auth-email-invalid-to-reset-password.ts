export class AuthEmailInvalidToResetPassword extends Error {
  constructor() {
    super("El email proporcionado no es válido para restablecer la contraseña.")
  }
}
