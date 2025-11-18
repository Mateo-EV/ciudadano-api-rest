export class GroupUser {
  groupId: string
  userId: string
  joinedAt: Date

  static create(props: Partial<GroupUser>): GroupUser {
    const groupUser = new GroupUser()
    Object.assign(groupUser, props)
    return groupUser
  }
}
