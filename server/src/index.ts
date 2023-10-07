import express, { Router } from 'express'
import { createServer } from 'http'
import WebSocket from 'ws'
import cors from 'cors'
import errorMiddleware from './middlewares/error-middleware'
import appController from './controllers/app-controller'
import * as uuid from 'uuid'

const app = express()
const server = createServer(app)
const wsServer = new WebSocket.Server({ server })
const router = Router()

interface IPlayerState {
  id: string
  x: number
  y: number
  xSpeed: number
  ySpeed: number
  color: string
  isOnGround: boolean
  controls: {
    isUp: boolean
    isLeft: boolean
    isRight: boolean
  }
}

const PLAYER_COLORS = ['#00DAE8', '#00CD77', '#FF6422', '#E8006F', '#883FFF']

const playersState: IPlayerState[] = []

router.get('/test', appController.healthChecker)
router.get('/new-player', (req, res) => {
  const newPlayer: IPlayerState = {
    color: PLAYER_COLORS[Math.floor(Math.random()) * PLAYER_COLORS.length],
    id: uuid.v4(),
    x: 0,
    y: 0,
    xSpeed: 0,
    ySpeed: 0,
    isOnGround: false,
    controls: {
      isUp: false,
      isLeft: false,
      isRight: false,
    },
  }

  playersState.push(newPlayer)

  res.send(newPlayer)
})
router.get('/get-player/:id', (req, res) => {
  const foundedPlayer = playersState.find((player) => player.id === req.params.id)

  res.send(foundedPlayer)
})

app.use(express.json())
app.use(cors())
app.use('/api', router)
app.use(errorMiddleware)

const sendToClients = (message: any) => {
  wsServer.clients.forEach((client: WebSocket) => {
    client.send(JSON.stringify(message))
  })
}

const start = async () => {
  let t = new Date()

  setInterval(() => {
    wsServer.clients.forEach((client: WebSocket) => {
      client.send('test')
    })
  }, 1000 / 60)

  try {
    wsServer.on('connection', (ws: WebSocket) => {
      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data)

          if (message.type === 'control') {
            for (let playerIndex = 0; playerIndex < playersState.length; playerIndex++) {
              if (playersState[playerIndex].id === message.id) {
                playersState[playerIndex].controls = message.controls
              }
            }
          }
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
    })

    server.listen('3001', () => console.log(`Server started on port ${3001}`))
  } catch (e) {
    console.log(e)
  }
}

start()
