export class ContactAlreadyExistsWithTheUserError extends Error {
  constructor() {
    super("El contacto ya existe con el usuario especificado.")
  }
}
