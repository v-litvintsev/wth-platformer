import express, { Router } from 'express'
import { createServer } from 'http'
import WebSocket from 'ws'
import cors from 'cors'
import errorMiddleware from './middlewares/error-middleware'
import appController from './controllers/app-controller'
import * as uuid from 'uuid'
import { SCENE_BLOCKS } from './constants/scene-blocks'

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

const PLAYER_COLORS = [
  '#00DAE8',
  '#00CD77',
  '#FF6422',
  '#E8006F',
  '#883FFF',
  '#BBEA01',
  '#4232FF',
  '#FFDE33',
  '#C75F00',
  '#8D58FE',
  '#FC429B',
  '#21DAB8',
  '#9ABD0B',
  '#26B1FF',
  '#1F00DB',
]

let playersState: IPlayerState[] = []

router.get('/test', appController.healthChecker)
router.get('/new-player', (req, res) => {
  res.send(uuid.v4())
})
app.use(express.json())
app.use(cors())
app.use('/api', router)
app.use(errorMiddleware)

const LOGIC_DATA = {
  RADIUS: 11,
  START_COORDS: {
    X: 160,
    Y: 850,
  },
}

const TARGET_DATA = {
  x: 168,
  y: 52,
  width: 34,
  height: 34,
}

let winnerPlayerId: string | null
let isGameInProgress = true
let isGameResetTimeoutStarted = false

const start = async () => {
  setInterval(() => {
    for (let playerIndex = 0; playerIndex < playersState.length; playerIndex++) {
      if (playersState[playerIndex].controls.isLeft) {
        playersState[playerIndex].xSpeed = playersState[playerIndex].xSpeed - 1

        if (Math.abs(playersState[playerIndex].xSpeed) > 5) {
          playersState[playerIndex].xSpeed = -5
        }
      }

      if (playersState[playerIndex].controls.isRight) {
        playersState[playerIndex].xSpeed = playersState[playerIndex].xSpeed + 1

        if (Math.abs(playersState[playerIndex].xSpeed) > 5) {
          playersState[playerIndex].xSpeed = 5
        }
      }

      if (playersState[playerIndex].controls.isUp && playersState[playerIndex].isOnGround) {
        playersState[playerIndex].ySpeed = -11
        playersState[playerIndex].isOnGround = false
      }

      playersState[playerIndex].x += playersState[playerIndex].xSpeed
      playersState[playerIndex].y += playersState[playerIndex].ySpeed

      playersState[playerIndex].xSpeed = playersState[playerIndex].xSpeed * 0.95

      if (!playersState[playerIndex].isOnGround) {
        playersState[playerIndex].ySpeed += 0.8
      }

      if (
        playersState[playerIndex].x - LOGIC_DATA.RADIUS <= 0 ||
        playersState[playerIndex].x + LOGIC_DATA.RADIUS >= 1000 ||
        playersState[playerIndex].y + LOGIC_DATA.RADIUS >= 1000
      ) {
        playersState[playerIndex].x = LOGIC_DATA.START_COORDS.X
        playersState[playerIndex].y = LOGIC_DATA.START_COORDS.Y
        playersState[playerIndex].xSpeed = 0
        playersState[playerIndex].ySpeed = 0
      }

      let isPlayerOnGround = false

      for (let blockIndex = 0; blockIndex < SCENE_BLOCKS.length; blockIndex++) {
        if (SCENE_BLOCKS[blockIndex].isGameStartBlock && !isGameInProgress) {
          continue
        }

        // Справа
        if (
          Math.abs(
            playersState[playerIndex].x -
              LOGIC_DATA.RADIUS -
              (SCENE_BLOCKS[blockIndex].x + SCENE_BLOCKS[blockIndex].width)
          ) < 2 &&
          playersState[playerIndex].y - LOGIC_DATA.RADIUS + 1 <
            SCENE_BLOCKS[blockIndex].y + SCENE_BLOCKS[blockIndex].height &&
          playersState[playerIndex].y + LOGIC_DATA.RADIUS - 1 > SCENE_BLOCKS[blockIndex].y
        ) {
          playersState[playerIndex].x =
            SCENE_BLOCKS[blockIndex].x + SCENE_BLOCKS[blockIndex].width + LOGIC_DATA.RADIUS + 2
          playersState[playerIndex].xSpeed = 0
        }

        // Слева
        if (
          Math.abs(playersState[playerIndex].x + LOGIC_DATA.RADIUS - SCENE_BLOCKS[blockIndex].x) <
            2 &&
          playersState[playerIndex].y - LOGIC_DATA.RADIUS + 1 <
            SCENE_BLOCKS[blockIndex].y + SCENE_BLOCKS[blockIndex].height &&
          playersState[playerIndex].y + LOGIC_DATA.RADIUS - 1 > SCENE_BLOCKS[blockIndex].y
        ) {
          playersState[playerIndex].x = SCENE_BLOCKS[blockIndex].x - LOGIC_DATA.RADIUS - 2
          playersState[playerIndex].xSpeed = 0
        }

        const isPlayerCollidesBlock =
          playersState[playerIndex].x + LOGIC_DATA.RADIUS >= SCENE_BLOCKS[blockIndex].x &&
          playersState[playerIndex].x - LOGIC_DATA.RADIUS <=
            SCENE_BLOCKS[blockIndex].x + SCENE_BLOCKS[blockIndex].width &&
          playersState[playerIndex].y + LOGIC_DATA.RADIUS >= SCENE_BLOCKS[blockIndex].y &&
          playersState[playerIndex].y - LOGIC_DATA.RADIUS <=
            SCENE_BLOCKS[blockIndex].y + SCENE_BLOCKS[blockIndex].height

        if (
          !(
            Math.abs(
              playersState[playerIndex].x + LOGIC_DATA.RADIUS - SCENE_BLOCKS[blockIndex].x
            ) <= 2 ||
            Math.abs(
              playersState[playerIndex].x -
                LOGIC_DATA.RADIUS -
                SCENE_BLOCKS[blockIndex].x +
                SCENE_BLOCKS[blockIndex].width
            ) <= 2
          ) &&
          isPlayerCollidesBlock
        ) {
          if (playersState[playerIndex].ySpeed < 0) {
            playersState[playerIndex].y =
              SCENE_BLOCKS[blockIndex].y + SCENE_BLOCKS[blockIndex].height + 1 + LOGIC_DATA.RADIUS
            playersState[playerIndex].ySpeed = 0
          } else {
            playersState[playerIndex].y = SCENE_BLOCKS[blockIndex].y - LOGIC_DATA.RADIUS
            isPlayerOnGround = true
            playersState[playerIndex].ySpeed = 0
          }
        }
      }

      playersState[playerIndex].isOnGround = isPlayerOnGround

      const isPlayerCollideTarget =
        playersState[playerIndex].x + LOGIC_DATA.RADIUS >= TARGET_DATA.x &&
        playersState[playerIndex].x - LOGIC_DATA.RADIUS <= TARGET_DATA.x + TARGET_DATA.width &&
        playersState[playerIndex].y + LOGIC_DATA.RADIUS >= TARGET_DATA.y &&
        playersState[playerIndex].y - LOGIC_DATA.RADIUS <= TARGET_DATA.y + TARGET_DATA.height

      if (isPlayerCollideTarget) {
        winnerPlayerId = playersState[playerIndex].id
      }
    }

    wsServer.clients.forEach((client: WebSocket) => {
      client.send(
        JSON.stringify({
          playersState,
          sceneBlocks: SCENE_BLOCKS,
          type: 'update',
          isGameInProgress,
        })
      )

      if (winnerPlayerId) {
        const winner = playersState.find((player) => player.id === winnerPlayerId)

        client.send(JSON.stringify({ color: winner?.color, type: 'win' }))

        if (!isGameResetTimeoutStarted) {
          isGameResetTimeoutStarted = true

          setTimeout(() => {
            playersState.length = 0
            winnerPlayerId = null
            isGameInProgress = true
            isGameResetTimeoutStarted = false
          }, 5000)
        }
      }
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
              color: PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)],
              id: uuid.v4(),
              x: LOGIC_DATA.START_COORDS.X,
              y: LOGIC_DATA.START_COORDS.Y,
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

          if (message.type === 'start-game') {
            isGameInProgress = true
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
