export class UnauthorizedContactForUserError extends Error {
  constructor() {
    super("El usuario no está autorizado para acceder a este contacto")
  }
}
