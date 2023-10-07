import { Schema } from 'mongoose'
import { IUser } from '../models/user-model'

export default class UserDto {
  id: Schema.Types.ObjectId
  username: string

  constructor({ _id, username }: IUser) {
    this.id = _id
    this.username = username
  }
}
