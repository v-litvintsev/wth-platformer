import { check } from 'express-validator'

export enum EPaths {
  login = '/login',
  registration = '/registration',
  getUser = '/get-user',
  home = '/',
  chat = '/chat',
  getMessages = '/get-messages',
  changeUsername = '/change-username',
}

export const loginValidationRules = [
  check('username', 'Incorrect username').isLength({ min: 1, max: 18 }),
  check('password', 'Incorrect password').isLength({ min: 8, max: 32 }),
]

export const usernameValidationRule = [
  check('newUsername', 'Incorrect username').isLength({ min: 1, max: 18 }),
]
