import { DispatchAlertUseCase } from "@/contexts/app/alerts/application/usecases/dispatch-alert.use-case"
import {
  DispatchAlertRequestDto,
  dispatchAlertRequestSchema
} from "@/contexts/app/alerts/infrastructure/rest/request/dispatch-alert-request.dto"
import { User } from "@/contexts/app/user/domain/entities/user"
import { ZodValidationPipe } from "@/lib/zod/zod-validation.pipe"
import { Body, Controller, Post, Req } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"

@Controller("alerts")
export class AlertController {
  constructor(private readonly dispatchAlertUseCase: DispatchAlertUseCase) {}

  @Post("/dispatch")
  @ApiBearerAuth()
  async dispatchAlert(
    @Body(new ZodValidationPipe(dispatchAlertRequestSchema))
    dispatchAlertRequestDto: DispatchAlertRequestDto,
    @Req() req: Express.Request
  ) {
    const user = req.user as User

    const alertCreated = await this.dispatchAlertUseCase.execute({
      latitude: dispatchAlertRequestDto.latitude,
      longitude: dispatchAlertRequestDto.longitude,
      user
    })

    return { data: alertCreated }
  }
}
