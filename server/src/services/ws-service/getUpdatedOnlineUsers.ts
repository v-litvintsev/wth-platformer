import { Document, Types } from 'mongoose'
import UserModel, { IUser } from '../../models/user-model'
import { generateOnlineUsersList } from '../../utils/generateOnlineUsersList'
import { EWsRequestTypes, IOnlineUsersUpdateMessage } from '../../ws-handlers/types'

export const getUpdatedOnlineUsers = async (
  id: string,
  isOnline: boolean
): Promise<IOnlineUsersUpdateMessage> => {
  const userId = new Types.ObjectId(id)

  const user = (await UserModel.findById(userId)) as Document & IUser
  user.isOnline = isOnline
  await user.save()

  const onlineUsers = (await UserModel.find({ isOnline: true })) as IUser[]
  const usernamesList = generateOnlineUsersList(onlineUsers)

  return { type: EWsRequestTypes.onlineUsersUpdate, onlineUsers: usernamesList }
}
