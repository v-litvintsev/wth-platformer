import WebSocket, { Server } from 'ws'
import ChatHandler from './chat-handler'
import HomeHandler from './home-handler'
import OnlineUsersHandler from './online-users-handler'
import { TWsMessage } from './types'

export default (wss: Server) => (ws: WebSocket) => {
  ws.send('testsdsfsdf')

  ws.on('message', (data: string) => {
    try {
      const message = JSON.parse(data) as TWsMessage
    } catch (e) {
      console.error(e)
    }

    // homeHandler.onMessage(message)
    // chatHandler.onMessage(message)
    // onlineUsersHandler.onMessage(message)
  })

  ws.on('close', () => {
    // onlineUsersHandler.onClose()
  })

  ws.on('error', (error: Error) => {
    // onlineUsersHandler.onError(error)
  })
}
