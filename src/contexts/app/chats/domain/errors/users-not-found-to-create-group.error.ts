export class UsersNotFoundToCreateGroupError extends Error {
  constructor() {
    super("Algunos usuarios no fueron encontrados para crear el grupo.")
  }
}
