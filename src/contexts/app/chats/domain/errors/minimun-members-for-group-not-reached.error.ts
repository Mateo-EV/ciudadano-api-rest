export class MinimumMembersForGroupNotReachedError extends Error {
  constructor() {
    super("No se alcanzó el número mínimo de 3 miembros para crear un grupo.")
  }
}
