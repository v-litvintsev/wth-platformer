import { Router } from 'express'
import appController from '../controllers/app-controller'

const router = Router()

router.get('/test', appController.healthChecker)

export default router
