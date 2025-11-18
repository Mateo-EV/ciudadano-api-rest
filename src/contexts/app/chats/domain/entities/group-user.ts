export class GroupUser {
  group_id: string
  user_id: string
  joined_at: Date

  static create(props: Partial<GroupUser>): GroupUser {
    const groupUser = new GroupUser()
    Object.assign(groupUser, props)
    return groupUser
  }
}
