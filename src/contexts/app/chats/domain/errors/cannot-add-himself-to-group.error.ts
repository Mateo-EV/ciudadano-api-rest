export class CannotAddHimselfToGroupError extends Error {
  constructor() {
    super("No se puede agregar a uno mismo al grupo")
  }
}
