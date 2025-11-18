import type { GroupUser } from "@/contexts/app/chats/domain/entities/group-user"

export class Group {
  id: string
  name: string
  description: string | null
  createdAt: Date
  members: GroupUser[]

  static create(props: Partial<Group>): Group {
    const group = new Group()
    Object.assign(group, props)
    return group
  }
}
