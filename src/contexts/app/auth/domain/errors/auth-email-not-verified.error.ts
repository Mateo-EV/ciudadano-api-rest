export class AuthEmailNotVerifiedError extends Error {
  constructor() {
    super("El correo electrónico no ha sido verificado.")
  }
}
