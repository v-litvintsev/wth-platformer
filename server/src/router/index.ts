import { Router } from 'express'
import appController from '../controllers/app-controller'
import authController from '../controllers/auth-controller'
import { EPaths, loginValidationRules, usernameValidationRule } from './constants'

const router = Router()

router.post(EPaths.login, loginValidationRules, authController.login)

router.post(EPaths.registration, loginValidationRules, authController.registration)

router.get(EPaths.getUser, appController.getUser)

router.get(EPaths.getMessages, appController.getMessages)

router.post(EPaths.changeUsername, usernameValidationRule, appController.changeUsername)

export default router
