export class AuthInvalidEmailOrCodeToResetPassword extends Error {
  constructor() {
    super(
      "El correo electrónico o el código para restablecer la contraseña no son válidos."
    )
  }
}
