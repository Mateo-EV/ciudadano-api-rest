export class AuthInvalidEmailOrCodeToVerify extends Error {
  constructor() {
    super("El correo electrónico o el código de verificación son inválidos.")
  }
}
