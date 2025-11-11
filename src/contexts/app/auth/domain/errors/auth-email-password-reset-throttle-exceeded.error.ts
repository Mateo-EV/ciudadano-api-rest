export class AuthEmailPasswordResetThrottleExceededError extends Error {
  constructor() {
    super(
      "La cantidad de solicitudes de restablecimiento de contraseña ha excedido el límite. Por favor, inténtelo de nuevo más tarde."
    )
  }
}
