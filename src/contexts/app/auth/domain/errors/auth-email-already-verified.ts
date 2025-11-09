export class AuthEmailAlreadyVerified extends Error {
  constructor() {
    super("El correo electrónico ya ha sido verificado.")
  }
}
