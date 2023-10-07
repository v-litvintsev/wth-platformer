import WebSocket from 'ws'
import { TWsMessage, TWsRequest } from '../../ws-handlers/types'

export const sendToClients = (wsServer: WebSocket.Server, message: TWsRequest) => {
  wsServer.clients.forEach((client: WebSocket) => {
    client.send(JSON.stringify(message))
  })
}
