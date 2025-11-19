import { GeogridRepository } from "@/contexts/app/geolocalization/domain/contracts/geogrid.repository"
import { GeolocalizationWsGateway } from "@/contexts/app/geolocalization/infrastructure/ws/gateways/geolocalization-ws.gateway"
import { IncidentReportedEvent } from "@/contexts/app/incidents/domain/event/incident-reported.event"
import { EventsHandler, IEventHandler } from "@nestjs/cqrs"

@EventsHandler(IncidentReportedEvent)
export class IncidentReportedHandler
  implements IEventHandler<IncidentReportedEvent>
{
  constructor(
    private readonly geolocalizationWsGateway: GeolocalizationWsGateway,
    private readonly geogridRepository: GeogridRepository
  ) {}

  handle(event: IncidentReportedEvent) {
    const incident = event.incident

    const geocellKeys = this.geogridRepository.getNeighboringCellKeys(
      incident.geolocation.latitude,
      incident.geolocation.longitude
    )

    geocellKeys.forEach(geocellKey => {
      this.geolocalizationWsGateway.server
        .to(`grid-area:${geocellKey}`)
        .emit("incident:reported", { incident })
    })
  }
}
