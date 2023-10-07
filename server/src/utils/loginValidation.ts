import { Request } from 'express'
import { validationResult } from 'express-validator'
import ApiError from '../services/exceptions/api-error'

export const requestValidation = (req: Request) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw ApiError.BadRequest('Incorrect user data', errors.array())
  }
}
