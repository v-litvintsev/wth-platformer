import { NextFunction, Request, Response } from 'express'

class AppController {
  healthChecker = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send('Server works...')
    } catch (e) {
      next(e)
    }
  }
}

export default new AppController()
