export class CursorPaginated<T> {
  items: T[]
  nextCursor: string | null

  constructor(items: T[], nextCursor: string | null) {
    this.items = items
    this.nextCursor = nextCursor
  }
}
