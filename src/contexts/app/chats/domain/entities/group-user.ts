export class GroupUser {
  groupId: string
  userId: string
  joinedAt: Date
  user: {
    id: string
    firstName: string
    lastName: string
    phone: string
  }

  static create(props: Partial<GroupUser>): GroupUser {
    const groupUser = new GroupUser()
    Object.assign(groupUser, props)
    return groupUser
  }
}
