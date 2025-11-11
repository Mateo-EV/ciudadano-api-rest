import { GetNearbyIncidentsToLocationUseCase } from "@/contexts/app/incidents/application/usecases/get-nearby-incidents-to-location.use-case"
import { ReportIncidentUseCase } from "@/contexts/app/incidents/application/usecases/report-incident.use-case"
import { UnreportIncidentUseCase } from "@/contexts/app/incidents/application/usecases/unreport-incident.use-case"
import {
  ReportIncidentRequestDto,
  reportIncidentRequestSchema
} from "@/contexts/app/incidents/infrastructure/rest/requests/report-incident-request.dto"
import { User } from "@/contexts/app/user/domain/entities/user"
import { ZodValidationPipe } from "@/lib/zod/zod-validation.pipe"
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFloatPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger"

@Controller("incidents")
export class IncidentController {
  constructor(
    private readonly getNearbyIncidentsToLocationUseCase: GetNearbyIncidentsToLocationUseCase,
    private readonly reportIncidentUseCase: ReportIncidentUseCase,
    private readonly unReportIncidentUseCase: UnreportIncidentUseCase
  ) {}

  @Get("nearby")
  @ApiBearerAuth()
  async getNearbyIncidents(
    @Query("lat", ParseFloatPipe) latitude: number,
    @Query("lon", ParseFloatPipe) longitude: number
  ) {
    const incidents = await this.getNearbyIncidentsToLocationUseCase.execute({
      latitude,
      longitude
    })

    return { data: incidents }
  }

  @Post("report")
  @UseInterceptors(FileInterceptor("multimedia"))
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  async reportIncident(
    @UploadedFile() multimedia: Express.Multer.File,
    @Body(new ZodValidationPipe(reportIncidentRequestSchema))
    reportIncidentRequestDto: ReportIncidentRequestDto,
    @Req() req: Express.Request
  ) {
    const user = req.user as User

    const incident = await this.reportIncidentUseCase.execute({
      description: reportIncidentRequestDto.description,
      incidentType: reportIncidentRequestDto.incident_type,
      geolocation: {
        latitude: reportIncidentRequestDto.latitude,
        longitude: reportIncidentRequestDto.longitude
      },
      multimedia,
      user_id: user.id
    })

    return { data: incident }
  }

  @Delete("unreport/:id")
  @ApiBearerAuth()
  async unreportIncident(@Param("id") id: string, @Req() req: Express.Request) {
    const user = req.user as User

    await this.unReportIncidentUseCase.execute({
      incidentId: id,
      userId: user.id
    })

    return {
      message: "Incidente eliminado correctamente"
    }
  }
}
