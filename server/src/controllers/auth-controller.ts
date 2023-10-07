import { NextFunction, Request, Response } from 'express'
import UserModel, { IUser } from '../models/user-model'
import ApiError from '../services/exceptions/api-error'
import { requestValidation } from '../utils/loginValidation'
import bcrypt from 'bcrypt'
import { generateAccessToken } from '../utils/generateAccessToken'

interface ILoginRequest {
  username: string
  password: string
}

class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      requestValidation(req)

      const { username, password } = req.body as ILoginRequest
      const user = (await UserModel.findOne({ username })) as IUser

      if (!user) {
        throw ApiError.BadRequest(`User not founded`)
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password)

      if (!isPasswordValid) {
        throw ApiError.BadRequest('Wrong password')
      }

      const accessToken = generateAccessToken(user._id, username)
      return res.json({ accessToken, id: user._id })
    } catch (e) {
      next(e)
    }
  }

  registration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      requestValidation(req)

      const { username, password } = req.body as ILoginRequest
      const candidate = (await UserModel.findOne({ username })) as IUser

      if (candidate) {
        throw ApiError.BadRequest('Username is already taken')
      }

      const passwordHash = bcrypt.hashSync(password, 3)
      const user = new UserModel({ username, password: passwordHash })
      await user.save()

      return res.json({ message: 'User registered successfully' })
    } catch (e) {
      next(e)
    }
  }
}

export default new AuthController()
