import WebSocket from 'ws'
import { handleNewMessage } from '../services/ws-service/handleNewMessage'
import { EWsMessageTypes, TWsMessage } from './types'

export default class ChatHandler {
  constructor(private wsServer: WebSocket.Server, private ws: WebSocket) {}

  onMessage = async (message: TWsMessage) => {
    switch (message.type) {
      case EWsMessageTypes.newReceivedMessage:
        handleNewMessage(this.wsServer, { ...message })
    }
  }
}
