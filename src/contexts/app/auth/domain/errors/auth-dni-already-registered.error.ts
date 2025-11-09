export class AuthDniAlreadyRegisteredError extends Error {
  constructor(dni: string) {
    super("El DNI " + dni + " ya está registrado en el sistema.")
  }
}
