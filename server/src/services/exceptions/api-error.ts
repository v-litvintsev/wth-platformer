import { ValidationError } from 'express-validator'

type TErrors = Error[] | ValidationError[]

export default class ApiError extends Error {
  constructor(public status: number, message: string, public errors: TErrors = []) {
    super(message)
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User not authorized')
  }

  static BadRequest(message: string, errors: TErrors = []) {
    return new ApiError(400, message, errors)
  }
}
