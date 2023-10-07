import WebSocket, { Server } from 'ws'
import ChatHandler from './chat-handler'
import HomeHandler from './home-handler'
import OnlineUsersHandler from './online-users-handler'
import { TWsMessage } from './types'

export default (wss: Server) => (ws: WebSocket) => {
  const homeHandler = new HomeHandler(wss, ws)
  const chatHandler = new ChatHandler(wss, ws)
  const onlineUsersHandler = new OnlineUsersHandler(wss, ws)

  ws.send('testsdsfsdf')
  

  ws.on('message', (data: string) => {
    const message = JSON.parse(data) as TWsMessage

    homeHandler.onMessage(message)
    chatHandler.onMessage(message)
    onlineUsersHandler.onMessage(message)
  })

  ws.on('close', () => {
    onlineUsersHandler.onClose()
  })

  ws.on('error', (error: Error) => {
    onlineUsersHandler.onError(error)
  })
}
