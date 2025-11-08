export class AuthEmailAlreadyRegisteredError extends Error {
  constructor(email: string) {
    super(`El email ${email} ya está registrado.`)
  }
}
