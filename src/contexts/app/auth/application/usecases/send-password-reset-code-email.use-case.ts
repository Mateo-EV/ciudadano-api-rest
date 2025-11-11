import { MailPasswordResetManager } from "@/contexts/app/auth/application/managers/mail-password-reset.manager"
import { AuthEmailInvalidToResetPassword } from "@/contexts/app/auth/domain/errors/auth-email-invalid-to-reset-password"
import { UserRepository } from "@/contexts/app/user/domain/contracts/user.repository"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

interface SendPasswordResetCodeEmailInput {
  email: string
}

@Injectable()
export class SendPasswordResetCodeEmailUseCase
  implements UseCase<SendPasswordResetCodeEmailInput, void>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailPasswordResetManager: MailPasswordResetManager
  ) {}

  async execute(input: SendPasswordResetCodeEmailInput): Promise<void> {
    const { email } = input

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AuthEmailInvalidToResetPassword()
    }

    await this.mailPasswordResetManager.sendPasswordResetCodeEmail(
      email,
      user.id
    )
  }
}
