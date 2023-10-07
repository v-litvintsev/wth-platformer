import { NextFunction, Request, Response } from 'express'
import UserModel, { IUser } from '../models/user-model'
import UserDto from '../dtos/user-dto'
import { getAccessTokenPayload } from '../utils/getAccessTokenPayload'
import MessageModel, { IMessage } from '../models/message-model'
import MessageDto from '../dtos/message-dto'
import { Document } from 'mongoose'
import { requestValidation } from '../utils/loginValidation'
import ApiError from '../services/exceptions/api-error'

interface IChangeUsernameRequest {
  newUsername: string
}

class AppController {
  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = getAccessTokenPayload(req)

      const user = (await UserModel.findById(id)) as IUser

      return res.json(new UserDto(user))
    } catch (e) {
      next(e)
    }
  }

  getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = (await MessageModel.find()) as IMessage[]

      return res.json({
        messages: messages.map((message) => new MessageDto(message)),
      })
    } catch (e) {
      next(e)
    }
  }

  changeUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
      requestValidation(req)

      const { id } = getAccessTokenPayload(req)
      const user = (await UserModel.findById(id)) as IUser & Document

      const { newUsername } = req.body as IChangeUsernameRequest
      const candidate = (await UserModel.findOne({ username: newUsername })) as IUser

      if (candidate) {
        throw ApiError.BadRequest('Username is already taken')
      }

      user.username = newUsername

      await user.save()
      return res.json({ newUsername, message: 'Username changed successfully' })
    } catch (e) {
      next(e)
    }
  }
}

export default new AppController()
