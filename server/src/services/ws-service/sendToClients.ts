import WebSocket from 'ws'

export const sendToClients = (wsServer: WebSocket.Server, message: any) => {
  wsServer.clients.forEach((client: WebSocket) => {
    client.send(JSON.stringify(message))
  })
}
