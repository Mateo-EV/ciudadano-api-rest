export class AuthEmailVerificationThrottleExceededError extends Error {
  constructor() {
    super(
      "La cantidad de solicitudes de verificación de correo electrónico ha excedido el límite. Por favor, inténtelo de nuevo más tarde."
    )
  }
}
