import { Injectable } from "@nestjs/common"
import { UserRepository } from "../../../user/domain/contracts/user.repository"
import { HashContract } from "../../domain/contracts/hash.contract"
import { TokenContract } from "../../domain/contracts/token.contract"
import { AuthInvalidCredentialsError } from "../../domain/errors/auth-invalid-credentials.error"
import { AuthEmailNotVerifiedError } from "../../domain/errors/auth-email-not-verified.error"

@Injectable()
export class LoginAuthUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashContract: HashContract,
    private readonly tokenContract: TokenContract
  ) {}

  async execute(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AuthInvalidCredentialsError()
    }

    const isValidPassword = await this.hashContract.compare(
      password,
      user.password
    )
    if (!isValidPassword) {
      throw new AuthInvalidCredentialsError()
    }

    if (!user.isEmailVerified) {
      throw new AuthEmailNotVerifiedError()
    }

    const token = await this.tokenContract.generate(user.id)

    return { token }
  }
}
