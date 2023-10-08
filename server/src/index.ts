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

const PLAYER_COLORS = [
  '#00DAE8',
  '#00CD77',
  '#FF6422',
  '#E8006F',
  '#883FFF',
  '#BBEA01',
  '#4232FF',
  '#FFDE33',
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

const sendToClients = (message: any) => {
  wsServer.clients.forEach((client: WebSocket) => {
    client.send(JSON.stringify(message))
  })
}

const LOGIC_DATA = {
  RADIUS: 11,
  START_COORDS: {
    X: 160,
    Y: 755,
  },
}

interface ISceneBlock {
  x: number
  y: number
  width: number
  height: number
}

const SCENE_BLOCKS: ISceneBlock[] = [
  {
    x: 56,
    y: 802,
    width: 170,
    height: 8,
  },
  {
    x: 286,
    y: 766,
    width: 108,
    height: 8,
  },
  {
    x: 410,
    y: 788,
    width: 61,
    height: 8,
  },
  {
    x: 509,
    y: 683,
    width: 61,
    height: 8,
  },
  {
    x: 712,
    y: 676,
    width: 84,
    height: 8,
  },
  {
    x: 670,
    y: 581,
    width: 84,
    height: 8,
  },
  {
    x: 862,
    y: 515,
    width: 13,
    height: 8,
  },
  {
    x: 930,
    y: 427,
    width: 14,
    height: 8,
  },
  {
    x: 608,
    y: 473,
    width: 38,
    height: 8,
  },
  {
    x: 359,
    y: 509,
    width: 131,
    height: 8,
  },
  {
    x: 298,
    y: 397,
    width: 67,
    height: 8,
  },
  {
    x: 464,
    y: 319,
    width: 52,
    height: 8,
  },
  {
    x: 608,
    y: 369,
    width: 221,
    height: 8,
  },
]

const TARGET_DATA = {
  x: 703,
  y: 332,
  width: 32,
  height: 32,
}

let winnerPlayerId: string

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
        playersState[playerIndex].ySpeed = -10
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
        const isPlayerCollidesBlock =
          playersState[playerIndex].x + LOGIC_DATA.RADIUS >= SCENE_BLOCKS[blockIndex].x &&
          playersState[playerIndex].x - LOGIC_DATA.RADIUS <=
            SCENE_BLOCKS[blockIndex].x + SCENE_BLOCKS[blockIndex].width &&
          playersState[playerIndex].y + LOGIC_DATA.RADIUS >= SCENE_BLOCKS[blockIndex].y &&
          playersState[playerIndex].y - LOGIC_DATA.RADIUS <=
            SCENE_BLOCKS[blockIndex].y + SCENE_BLOCKS[blockIndex].height

        if (isPlayerCollidesBlock) {
          if (playersState[playerIndex].ySpeed < 0) {
            playersState[playerIndex].y =
              SCENE_BLOCKS[blockIndex].y + SCENE_BLOCKS[blockIndex].height + 1
            playersState[playerIndex].ySpeed = 0
          } else {
            playersState[playerIndex].y = SCENE_BLOCKS[blockIndex].y - LOGIC_DATA.RADIUS
            isPlayerOnGround = true
            playersState[playerIndex].ySpeed = 0
          }
        }

        // WIP Если будет необходимость в коллизиях по x
        // // Если не стоит на блоке
        // // Если не под блоком
        // // Если по вертикали начало игрока - LOGIC_DATA.RADIUS
        // if (playersState[playerIndex].x + LOGIC_DATA.RADIUS) {
        //   if (playersState[playerIndex].xSpeed < 0) {
        //     playersState[playerIndex].x =
        //       SCENE_BLOCKS[blockIndex].x + SCENE_BLOCKS[blockIndex].width
        //     playersState[playerIndex].xSpeed = 0
        //   } else {
        //     playersState[playerIndex].x = SCENE_BLOCKS[blockIndex].x - LOGIC_DATA.RADIUS
        //     playersState[playerIndex].xSpeed = 0
        //   }
        // }
      }

      playersState[playerIndex].isOnGround = isPlayerOnGround

      const isPlayerCollideTarget =
        playersState[playerIndex].x >= TARGET_DATA.x &&
        playersState[playerIndex].x <= TARGET_DATA.x + TARGET_DATA.width &&
        playersState[playerIndex].y >= TARGET_DATA.y &&
        playersState[playerIndex].y <= TARGET_DATA.y + TARGET_DATA.height

      if (isPlayerCollideTarget) {
        winnerPlayerId = playersState[playerIndex].id
      }
    }

    wsServer.clients.forEach((client: WebSocket) => {
      client.send(JSON.stringify({ playersState, sceneBlocks: SCENE_BLOCKS, type: 'update' }))

      if (winnerPlayerId) {
        client.send(JSON.stringify({ winnerPlayerId, type: 'win' }))
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
