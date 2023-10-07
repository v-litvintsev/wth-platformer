import { Document } from 'mongoose'
import { MAX_MESSAGES_COUNT } from '../../constants/chat'
import MessageModel, { IMessage } from '../../models/message-model'

export const deleteOverflowedMessage = async () => {
  const messages = (await MessageModel.find()) as IMessage[] & Document[]

  if (messages.length > MAX_MESSAGES_COUNT) {
    messages[0].delete()
  }
}
