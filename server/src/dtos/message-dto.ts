import { Schema } from 'mongoose'
import { IMessage } from '../models/message-model'

export default class MessageDto {
  id: Schema.Types.ObjectId
  author: string
  text: string
  createdAt: string
  authorId: Schema.Types.ObjectId

  constructor({ _id, author, text, createdAt, authorId }: IMessage) {
    this.id = _id
    this.author = author
    this.text = text
    this.createdAt = createdAt
    this.authorId = authorId
  }
}
