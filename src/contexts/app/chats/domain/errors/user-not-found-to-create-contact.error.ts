export class UserNotFoundToCreateContactError extends Error {
  constructor() {
    super("El usuario que se intenta agregar como contacto no existe.")
  }
}
