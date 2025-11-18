export class UserWithoutPhoneCannotHaveContactsError extends Error {
  constructor() {
    super("Un usuario sin teléfono no puede tener contactos.")
  }
}
