import { Application, Request, Response } from 'express'
import { RouteMethod, V1Routes } from '../v1-api-routes'

export default class ExampleRoutes extends V1Routes {
  constructor (app: Application) {
    super(app)
    this.routes.push(this.example)
  }

  private example = {
    method: RouteMethod.GET,
    route: 'example',
    handler: async (req: Request, res: Response) => {
      if (!req.params || !req.params.requiredParam) {
        return res.BadRequest()
      }

      try {
        return res.OK('example response')
      } catch (error) {
        console.error(error)
        return res.Error('Failed')
      }
    }
  }
}
