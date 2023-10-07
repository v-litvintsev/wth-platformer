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

let playersState: IPlayerState[] = []

router.get('/test', appController.healthChecker)
router.get('/new-player', (req, res) => {
  res.send(uuid.v4())
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
  setInterval(() => {
    for (let playerIndex = 0; playerIndex < playersState.length; playerIndex++) {
      if (playersState[playerIndex].controls.isLeft) {
        playersState[playerIndex].xSpeed = playersState[playerIndex].xSpeed - 1
      }

      if (playersState[playerIndex].controls.isRight) {
        playersState[playerIndex].xSpeed = playersState[playerIndex].xSpeed + 1
      }

      if (playersState[playerIndex].controls.isUp) {
        playersState[playerIndex].ySpeed = -10
        playersState[playerIndex].isOnGround = false
      }

      playersState[playerIndex].x += playersState[playerIndex].xSpeed
      playersState[playerIndex].y += playersState[playerIndex].ySpeed
    }

    wsServer.clients.forEach((client: WebSocket) => {
      client.send(JSON.stringify(playersState))
    })
  }, 1000 / 60)

  try {
    wsServer.on('connection', (ws: WebSocket) => {
      let player: IPlayerState

      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data)

          if (message.type === 'new-player') {
            player = {
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
            playersState.push(player)

            ws.send(JSON.stringify({ ...player, type: 'new-player' }))
          }

          if (message.type === 'control') {
            for (let playerIndex = 0; playerIndex < playersState.length; playerIndex++) {
              if (playersState[playerIndex].id === message.id) {
                playersState[playerIndex].controls = message.controls
              }
            }
          }
        } catch (e) {}
      })

      ws.on('close', () => {
        if (player) {
          playersState = playersState.filter((statePlayer) => statePlayer.id !== player.id)
        }
      })

      ws.on('error', (error: Error) => {
        if (player) {
          playersState = playersState.filter((statePlayer) => statePlayer.id !== player.id)
        }
      })
    })

    server.listen('3001', () => console.log(`Server started on port ${3001}`))
  } catch (e) {
    console.log(e)
  }
}

start()
