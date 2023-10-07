import WebSocket from 'ws'
import counterData from '../services/counterData/counterData'
import { sendToClients } from '../services/ws-service/sendToClients'
import { EWsMessageTypes, EWsRequestTypes, IHomeMessage, TWsMessage } from './types'

export default class HomeHandler {
  constructor(private wsServer: WebSocket.Server, private ws: WebSocket) {}

  onMessage = async (message: TWsMessage) => {
    switch (message.type) {
      case EWsMessageTypes.homeClickMessage:
        counterData.setCounter(counterData.counter + 1)
        counterData.setLastClick(message.lastClick)

        const response: IHomeMessage = {
          type: EWsRequestTypes.homeMessage,
          counter: counterData.counter,
          lastClick: counterData.lastClick,
        }

        sendToClients(this.wsServer, response)
    }
  }

  onOpen = () => {
    const message: IHomeMessage = {
      type: EWsRequestTypes.homeMessage,
      counter: counterData.counter,
      lastClick: counterData.lastClick,
    }

    this.ws.send(JSON.stringify(message))
  }
}
