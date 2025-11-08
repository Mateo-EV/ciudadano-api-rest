import { Injectable } from "@nestjs/common"
import { HashContract } from "../../domain/contracts/hash.contract"
import bcrypt from "bcryptjs"

@Injectable()
export class HashService implements HashContract {
  compare(content: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(content, hashed)
  }

  hash(content: string): Promise<string> {
    return bcrypt.hash(content, 10)
  }
}
