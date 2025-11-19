import type { User } from "../entities/user"

export abstract class UserRepository {
  abstract create(user: User): Promise<User>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: string): Promise<User | null>
  abstract updateById(
    userId: string,
    user: Partial<Omit<User, "id">>
  ): Promise<User>
  abstract delete(id: string): Promise<void>
  abstract markEmailAsVerified(userId: string): Promise<void>
  abstract findByDni(dni: string): Promise<User | null>
  abstract findByIds(userIds: string[]): Promise<User[]>
  abstract findPossibleContactsByPhones(
    phones: string[],
    userSearchingId: string
  ): Promise<User[]>
}
