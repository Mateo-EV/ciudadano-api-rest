export class AuthEmailInvalidToVerify extends Error {
  constructor() {
    super("El email proporcionado no es válido para verificar.")
  }
}
