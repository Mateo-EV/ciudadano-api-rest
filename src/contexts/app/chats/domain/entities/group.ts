export class Group {
  id: string
  name: string
  description: string
  created_at: Date

  static create(props: Partial<Group>): Group {
    const group = new Group()
    Object.assign(group, props)
    return group
  }
}
