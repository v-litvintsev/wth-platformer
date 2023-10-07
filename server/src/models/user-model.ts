import { model, Schema } from 'mongoose'

export interface IUser {
  username: string
  password: string
  isOnline: boolean
  _id: Schema.Types.ObjectId
}

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
})

export default model('User', userSchema)
