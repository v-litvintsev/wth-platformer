import { Document } from 'mongoose'
import { Server } from 'ws'
import MessageModel, { IMessage } from '../../models/message-model'
import { EWsRequestTypes, ISendingMessage } from '../../ws-handlers/types'
import { deleteOverflowedMessage } from './deleteOverflowedMessage'
import { sendToClients } from './sendToClients'

interface INewMessageData {
  author: string
  text: string
}

export const handleNewMessage = async (wsServer: Server, messageData: INewMessageData) => {
  const message = new MessageModel({ ...messageData }) as IMessage & Document
  await message.save()

  const messageEvent: ISendingMessage = {
    authorId: message.authorId,
    type: EWsRequestTypes.newSendingMessage,
    author: messageData.author,
    text: messageData.text,
    createdAt: message.createdAt,
    id: message._id,
  }

  sendToClients(wsServer, messageEvent)
  deleteOverflowedMessage()
}
