import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { UserRepository } from "../../../user/domain/contracts/user.repository"
import { User } from "../../../user/domain/entities/user"
import { HashContract } from "../../domain/contracts/hash.contract"
import { AuthEmailAlreadyRegisteredError } from "../../domain/errors/auth-email-already-registered.error"
import { MailVerificationManager } from "../managers/mail-verification.manager"

interface RegisterAuthUserCaseInput {
  email: string
  password: string
  firstName: string
  lastName: string
  dni: string
}

@Injectable()
export class RegisterAuthUserCase
  implements UseCase<RegisterAuthUserCaseInput, User>
{
  constructor(
    private readonly mailVerificationManager: MailVerificationManager,
    private readonly userRepository: UserRepository,
    private readonly hashContract: HashContract
  ) {}

  async execute(input: RegisterAuthUserCaseInput): Promise<User> {
    const thereIsUserWithEmail = await this.userRepository.findByEmail(
      input.email
    )

    if (thereIsUserWithEmail) {
      throw new AuthEmailAlreadyRegisteredError(input.email)
    }

    const hashedPassword = await this.hashContract.hash(input.password)

    const newUser = await this.userRepository.create(
      User.create({
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        dni: input.dni
      })
    )

    void this.mailVerificationManager.sendVerificationCode(
      newUser.email,
      newUser.id
    )

    return newUser
  }
}
