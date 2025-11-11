import { UserRepository } from "@/contexts/app/user/domain/contracts/user.repository"
import { User } from "@/contexts/app/user/domain/entities/user"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"
import { HashContract } from "../../domain/contracts/hash.contract"

interface UpdateProfileUseCaseInput {
  userId: string
  userData: {
    firstName?: string
    lastName?: string
    password?: string
  }
}

@Injectable()
export class UpdateProfileUseCase
  implements UseCase<UpdateProfileUseCaseInput, User>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashContract: HashContract
  ) {}

  async execute(input: UpdateProfileUseCaseInput): Promise<User> {
    return await this.userRepository.updateById(
      input.userId,
      User.create({
        firstName: input.userData.firstName,
        lastName: input.userData.lastName,
        password: input.userData.password
          ? await this.hashContract.hash(input.userData.password)
          : undefined
      })
    )
  }
}
