import type { UserRepository } from "../../../user/domain/contracts/user.repository"
import type { HashContract } from "../../domain/contracts/hash.contract"
import type { TokenContract } from "../../domain/contracts/token.contract"
import { AuthInvalidCredentialsError } from "../../domain/errors/auth-invalid-credentials.error"

export class LoginAuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private hash: HashContract,
    private token: TokenContract
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ token: string; isEmailVerified: boolean }> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AuthInvalidCredentialsError()
    }

    const isValidPassword = await this.hash.compare(password, user.password)
    if (!isValidPassword) {
      throw new AuthInvalidCredentialsError()
    }

    const token = await this.token.generate(user.id)

    return { token, isEmailVerified: user.isEmailVerified }
  }
}
