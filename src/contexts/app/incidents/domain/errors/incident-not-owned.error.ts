export class IncidentNotOwnedError extends Error {
  constructor(incidentId: string, userId: string) {
    super(
      `El incidente con ID ${incidentId} no es propiedad del usuario con ID ${userId}.`
    )
  }
}
