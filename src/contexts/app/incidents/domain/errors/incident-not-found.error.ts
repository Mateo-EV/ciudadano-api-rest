export class IncidentNotFoundError extends Error {
  constructor(incidentId: string) {
    super(`Incidente con ID ${incidentId} no encontrado.`)
  }
}
