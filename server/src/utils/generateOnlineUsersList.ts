import { IUser } from '../models/user-model'

export const generateOnlineUsersList = (onlineUsers: IUser[]) => {
  return onlineUsers.map(({ _id, username }) => ({ id: _id, username }))
}
