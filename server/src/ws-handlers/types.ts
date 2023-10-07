import { ObjectId, Schema } from 'mongoose'

export enum EWsMessageTypes {
  openMessage = 'open_message',
  homeClickMessage = 'home_click_message',
  newReceivedMessage = 'new_message',
}

interface IOpenMessage {
  type: EWsMessageTypes.openMessage
  id: string
}

interface IHomeClickMessage {
  type: EWsMessageTypes.homeClickMessage
  lastClick: string
}

interface IReceivedMessage {
  type: EWsMessageTypes.newReceivedMessage
  author: string
  text: string
}

export type TWsMessage = IOpenMessage | IHomeClickMessage | IReceivedMessage

export enum EWsRequestTypes {
  homeMessage = 'home_message',
  onlineUsersUpdate = 'online_users_update',
  newSendingMessage = 'new_message',
}

interface IOnlineUser {
  username: string
  id: ObjectId
}

export interface IOnlineUsersUpdateMessage {
  type: EWsRequestTypes.onlineUsersUpdate
  onlineUsers: IOnlineUser[]
}

export interface ISendingMessage {
  authorId: Schema.Types.ObjectId
  type: EWsRequestTypes.newSendingMessage
  author: string
  text: string
  createdAt: string
  id: string
}

export interface IHomeMessage {
  type: EWsRequestTypes.homeMessage
  counter: number
  lastClick: string
}

export type TWsRequest = IHomeMessage | IOnlineUsersUpdateMessage | ISendingMessage
