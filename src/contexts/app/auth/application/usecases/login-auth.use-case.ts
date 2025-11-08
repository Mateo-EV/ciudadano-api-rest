import { Injectable } from "@nestjs/common"
import { UserRepository } from "../../../user/domain/contracts/user.repository"
import { HashContract } from "../../domain/contracts/hash.contract"
import { TokenContract } from "../../domain/contracts/token.contract"
import { AuthInvalidCredentialsError } from "../../domain/errors/auth-invalid-credentials.error"

@Injectable()
export class LoginAuthUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashContract: HashContract,
    private readonly tokenContract: TokenContract
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ token: string; isEmailVerified: boolean }> {
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

    const token = await this.tokenContract.generate(user.id)

    return { token, isEmailVerified: user.isEmailVerified }
  }
}
