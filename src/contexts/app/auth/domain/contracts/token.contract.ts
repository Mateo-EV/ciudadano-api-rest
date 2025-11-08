export abstract class TokenContract {
  abstract generate(userId: string): Promise<string>
  abstract verify(token: string): Promise<string>
}
