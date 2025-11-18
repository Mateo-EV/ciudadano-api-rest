export class UnuauthorizedGroupForUserError extends Error {
  constructor() {
    super("Usuario no es miembro del grupo")
  }
}
