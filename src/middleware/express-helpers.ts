import { NextFunction, Request, Response } from 'express'

function expressHelpers (req: Request, res: Response, next: NextFunction) {
  res.OK = function (response: any | undefined) {
    if (!response) {
      return res.sendStatus(200)
    }

    return res.status(200).json(response)
  }

  res.BadRequest = function () {
    return res.sendStatus(400)
  }

  res.Forbidden = function () {
    return res.sendStatus(403).end()
  }

  res.Unauthorized = function () {
    return res.sendStatus(401).end()
  }

  res.Error = function (message: string) {
    return res
      .status(500)
      .send(message)
      .end()
  }

  res.NotFound = function (type: string, objectId: number) {
    return res
      .status(404)
      .send(`Could not find ${type} resource for id ${objectId}`)
      .end()
  }

  next()
}

export default expressHelpers
