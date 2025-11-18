export class ContactNotFoundError extends Error {
  constructor() {
    super("Contacto no encontrado")
  }
}
