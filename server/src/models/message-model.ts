import { model, Schema } from 'mongoose'

export interface IMessage {
  authorId: Schema.Types.ObjectId
  author: string
  text: string
  createdAt: string
  _id: Schema.Types.ObjectId
}

const messageSchema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, required: true, ref: 'Message' },
    author: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
)

export default model('Message', messageSchema)
