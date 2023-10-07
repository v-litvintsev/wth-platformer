import express from 'express'
import { createServer } from 'http'
import WebSocket from 'ws'
import cors from 'cors'
import errorMiddleware from './middlewares/error-middleware'
import router from './router'
import wsHandler from './ws-handlers'

const app = express()
const server = createServer(app)
const wsServer = new WebSocket.Server({ server })

app.use(express.json())
app.use(cors())
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    wsServer.on('connection', wsHandler(wsServer))

    server.listen('3001', () => console.log(`Server started on port ${3001}`))
  } catch (e) {
    console.log(e)
  }
}

start()
