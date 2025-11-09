import { ZodValidationPipe } from "@/lib/zod/zod-validation.pipe"
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UsePipes
} from "@nestjs/common"
import { LoginAuthUseCase } from "../../../application/usecases/login-auth.use-case"
import { RegisterAuthUserCase } from "../../../application/usecases/register-auth.user-case"
import { VerifyEmailUseCase } from "../../../application/usecases/verify-email.use-case"
import { LoginRequestDto, loginRequestSchema } from "../requests/login.dto"
import {
  RegisterRequestDto,
  registerRequestSchema
} from "../requests/register.dto"
import {
  VerifyEmailRequestDto,
  verifyEmailRequestSchema
} from "../requests/verify-email-request.dto"
import { ResendEmailVerificationCodeUseCase } from "../../../application/usecases/resend-email-verification-code.use-case"
import {
  ResendEmailVerificationCodeRequestDto,
  resendEmailVerificationCodeRequestSchema
} from "../requests/resend-email-verification-code-request.dto"
import { Public } from "../../decorators/public"
import type { Request } from "express"
import { User } from "@/contexts/app/user/domain/entities/user"
import { ApiBearerAuth } from "@nestjs/swagger"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginAuthUseCase: LoginAuthUseCase,
    private readonly registerAuthUseCase: RegisterAuthUserCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendEmailVerificationCodeUseCase: ResendEmailVerificationCodeUseCase
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
}
