import { SendPasswordResetCodeEmailUseCase } from "@/contexts/app/auth/application/usecases/send-password-reset-code-email.use-case"
import {
  SendPasswordResetCodeEmailRequestDto,
  sendPasswordResetCodeEmailRequestSchema
} from "@/contexts/app/auth/infrastructure/rest/requests/send-password-reset-code-email-request.dto"
import { User } from "@/contexts/app/user/domain/entities/user"
import { ZodValidationPipe } from "@/lib/zod/zod-validation.pipe"
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UsePipes
} from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import type { Request } from "express"
import { LoginAuthUseCase } from "../../../application/usecases/login-auth.use-case"
import { RegisterAuthUserCase } from "../../../application/usecases/register-auth.user-case"
import { ResendEmailVerificationCodeUseCase } from "../../../application/usecases/resend-email-verification-code.use-case"
import { UpdateProfileUseCase } from "../../../application/usecases/update-profile.use-case"
import { VerifyEmailUseCase } from "../../../application/usecases/verify-email.use-case"
import { Public } from "../../decorators/public"
import { LoginRequestDto, loginRequestSchema } from "../requests/login.dto"
import {
  RegisterRequestDto,
  registerRequestSchema
} from "../requests/register.dto"
import {
  ResendEmailVerificationCodeRequestDto,
  resendEmailVerificationCodeRequestSchema
} from "../requests/resend-email-verification-code-request.dto"
import {
  UpdateProfileRequestDto,
  updateProfileRequestSchema
} from "../requests/update-profile-request.dto"
import {
  VerifyEmailRequestDto,
  verifyEmailRequestSchema
} from "../requests/verify-email-request.dto"
import {
  SendResetPasswordCodeEmailRequestDto,
  sendResetPasswordCodeEmailRequestSchema
} from "@/contexts/app/auth/infrastructure/rest/requests/reset-password-request.dto"
import { ResetPasswordUseCase } from "@/contexts/app/auth/application/usecases/reset-password.use-case"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginAuthUseCase: LoginAuthUseCase,
    private readonly registerAuthUseCase: RegisterAuthUserCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendEmailVerificationCodeUseCase: ResendEmailVerificationCodeUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly sendPasswordResetCodeEmailUseCase: SendPasswordResetCodeEmailUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  @Post("login")
  @Public()
  @UsePipes(new ZodValidationPipe(loginRequestSchema))
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginRequestDto: LoginRequestDto) {
    const { token } = await this.loginAuthUseCase.execute(
      loginRequestDto.email,
      loginRequestDto.password
    )

    return {
      data: {
        token
      },
      message: "Ingreso exitoso"
    }
  }

  @Post("register")
  @Public()
  @UsePipes(new ZodValidationPipe(registerRequestSchema))
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    const user = await this.registerAuthUseCase.execute(registerRequestDto)

    return {
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          dni: user.dni,
          email: user.email
        }
      },
      message: "Registro exitoso, verifica tu correo electrónico"
    }
  }

  @Post("verify-email")
  @Public()
  @UsePipes(new ZodValidationPipe(verifyEmailRequestSchema))
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailRequestDto) {
    await this.verifyEmailUseCase.execute(verifyEmailDto)

    return {
      message: "Email verificado exitosamente"
    }
  }

  @Post("resend-email-verification-code")
  @Public()
  @UsePipes(new ZodValidationPipe(resendEmailVerificationCodeRequestSchema))
  @HttpCode(HttpStatus.OK)
  async resendEmailVerificationCode(
    @Body()
    resendEmailVerificationCodeDto: ResendEmailVerificationCodeRequestDto
  ) {
    await this.resendEmailVerificationCodeUseCase.execute(
      resendEmailVerificationCodeDto.email
    )

    return {
      message: "Código de verificación reenviado exitosamente"
    }
  }

  @Post("send-password-reset-code-email")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async sendPasswordResetCodeEmail(
    @Body(new ZodValidationPipe(sendPasswordResetCodeEmailRequestSchema))
    sendPasswordResetCodeEmailRequestDto: SendPasswordResetCodeEmailRequestDto
  ) {
    await this.sendPasswordResetCodeEmailUseCase.execute({
      email: sendPasswordResetCodeEmailRequestDto.email
    })

    return {
      message: "Código de restablecimiento de contraseña enviado exitosamente"
    }
  }

  @Post("reset-password")
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body(new ZodValidationPipe(sendResetPasswordCodeEmailRequestSchema))
    sendResetPasswordCodeEmailRequestDto: SendResetPasswordCodeEmailRequestDto
  ) {
    await this.resetPasswordUseCase.execute({
      email: sendResetPasswordCodeEmailRequestDto.email,
      newPassword: sendResetPasswordCodeEmailRequestDto.password,
      code: sendResetPasswordCodeEmailRequestDto.code
    })

    return {
      message: "Contraseña restablecida exitosamente"
    }
  }

  @Get("profile")
  @ApiBearerAuth()
  getProfile(@Req() req: Request) {
    const user = req.user as User

    return {
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        dni: user.dni,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone
      }
    }
  }

  @Put("profile")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateProfileRequestSchema))
  async updateProfile(
    @Body() updateProfileRequestDto: UpdateProfileRequestDto,
    @Req() req: Request
  ) {
    const user = req.user as User

    const userUpdated = await this.updateProfileUseCase.execute({
      userData: updateProfileRequestDto,
      userId: user.id
    })

    return {
      data: {
        id: userUpdated.id,
        firstName: userUpdated.firstName,
        lastName: userUpdated.lastName,
        dni: userUpdated.dni,
        email: userUpdated.email,
        isEmailVerified: userUpdated.isEmailVerified,
        phone: userUpdated.phone
      },
      message: "Perfil actualizado exitosamente"
    }
  }
}
