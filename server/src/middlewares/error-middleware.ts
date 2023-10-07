import { NextFunction, Request, Response } from 'express'
import ApiError from '../services/exceptions/api-error'

export default (error: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.log(error)

  if (error?.status) {
    return res.status(error.status).json({ message: error.message, errors: error.errors })
  }

  return res.status(500).json({ message: 'Unexpected error' })
}
