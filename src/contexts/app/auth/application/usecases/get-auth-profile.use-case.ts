import { UserRepository } from "@/contexts/app/user/domain/contracts/user.repository"
import { User } from "@/contexts/app/user/domain/entities/user"
import { UseCase } from "@/utils/use-case"
import { Injectable } from "@nestjs/common"

@Injectable()
export class GetAuthProfileUseCase implements UseCase<string, User | null> {
  constructor(private readonly userRepository: UserRepository) {}

  execute(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId)
  }
}
