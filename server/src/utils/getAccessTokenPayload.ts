import { Request } from 'express'
import ApiError from '../services/exceptions/api-error'
import jwt from 'jsonwebtoken'
import { IAccessTokenPayload } from './generateAccessToken'

export const getAccessTokenPayload = (req: Request): IAccessTokenPayload => {
  const accessToken = req.headers.authorization?.split(' ')[1]
  if (!accessToken) {
    throw ApiError.UnauthorizedError()
  }

  const payload = jwt.decode(accessToken) as IAccessTokenPayload | null
  if (!payload || !payload.id) {
    throw ApiError.UnauthorizedError()
  }

  return payload
}
