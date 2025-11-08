export class AuthInvalidCredentialsError extends Error {
  constructor() {
    super("Email o contraseña inválidos")
  }
}
