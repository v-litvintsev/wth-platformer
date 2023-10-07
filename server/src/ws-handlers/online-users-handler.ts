import WebSocket from 'ws'
import { getUpdatedOnlineUsers } from '../services/ws-service/getUpdatedOnlineUsers'
import { sendToClients } from '../services/ws-service/sendToClients'
import { EWsMessageTypes, TWsMessage } from './types'

export default class OnlineUsersHandler {
  private id = ''

  constructor(private wsServer: WebSocket.Server, private ws: WebSocket) {}

  onMessage = async (message: TWsMessage) => {
    switch (message.type) {
      case EWsMessageTypes.openMessage:
        this.id = message.id

        const response = await getUpdatedOnlineUsers(message.id, true)

        sendToClients(this.wsServer, response)
    }
  }

  private onCloseOrError = async () => {
    // const response = await getUpdatedOnlineUsers(this.id, false)
    // sendToClients(this.wsServer, response)
  }

  onClose = () => {
    this.onCloseOrError()
  }

  onError = async (event: Error) => {
    this.onCloseOrError()
  }
}
