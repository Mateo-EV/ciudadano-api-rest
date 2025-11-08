export abstract class HashContract {
  abstract hash(content: string): Promise<string>
  abstract compare(content: string, hashed: string): Promise<boolean>
}
