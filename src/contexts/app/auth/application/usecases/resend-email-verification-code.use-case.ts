import { UserRepository } from "@/contexts/app/user/domain/contracts/user.repository"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { MailVerificationManager } from "../managers/mail-verification.manager"
import { AuthEmailInvalidToVerify } from "../../domain/errors/auth-email-invalid-to-verify"

@Injectable()
export class ResendEmailVerificationCodeUseCase
  implements UseCase<string, void>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailVerificationManager: MailVerificationManager
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email)

    if (!user || user.isEmailVerified) {
      throw new AuthEmailInvalidToVerify()
    }

    void this.mailVerificationManager.sendVerificationCode(email, user.id)
  }
}
