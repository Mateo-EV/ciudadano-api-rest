import { RegisterPushTokenUseCase } from "@/contexts/app/push_notifications/application/usecases/register-push-token.use-case"
import { UnregisterPushTokenUseCase } from "@/contexts/app/push_notifications/application/usecases/unregister-push-token.use-case"
import {
  RegisterPushTokenRequestDto,
  registerPushTokenRequestSchema
} from "@/contexts/app/push_notifications/infraestructure/rest/requests/register-push-token-request.dto"
import { User } from "@/contexts/app/user/domain/entities/user"
import { ZodValidationPipe } from "@/lib/zod/zod-validation.pipe"
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req
} from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"

@Controller("push-tokens")
export class PushTokenController {
  constructor(
    private readonly registerPushTokenUseCase: RegisterPushTokenUseCase,
    private readonly unregisterPushTokenUseCase: UnregisterPushTokenUseCase
  ) {}

  @Post("/register")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async registerPushToken(
    @Body(new ZodValidationPipe(registerPushTokenRequestSchema))
    registerPushTokenRequest: RegisterPushTokenRequestDto,
    @Req() req: Express.Request
  ) {
    const user = req.user as User

    const pushToken = await this.registerPushTokenUseCase.execute({
      token: registerPushTokenRequest.token,
      platform: registerPushTokenRequest.platform,
      userAuthId: user.id
    })

    return { pushToken }
  }

  @Delete("/unregister")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async unregisterPushToken(
    @Body(new ZodValidationPipe(registerPushTokenRequestSchema))
    unregisterPushTokenRequest: RegisterPushTokenRequestDto
  ) {
    await this.unregisterPushTokenUseCase.execute({
      token: unregisterPushTokenRequest.token
    })
  }
}
