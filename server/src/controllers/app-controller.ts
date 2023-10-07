import { NextFunction, Request, Response } from 'express'

class AppController {
  healthChecker = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send('test')
    } catch (e) {
      next(e)
    }
  }
}

export default new AppController()
